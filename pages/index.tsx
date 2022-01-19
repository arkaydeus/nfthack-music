import { useState } from "react";
import { Layout, WalletOptionsModal } from "../components";
import { createClient } from "urql";

interface MetadataJSON {
  json: Metadata;
}

interface Metadata {
  version: string;
  name: string;
  description: string;
  mimeType: string;
}

interface Token {
  tokenId: string;
  contentURI: string;
  metadata: MetadataJSON;
  type: string;
}

interface Props {
  tokens: Token[];
}

const APIURL = "https://indexer-prod-mainnet.ZORA.co/v1/graphql";
const mediasQuery = `
query {
    Media(
        order_by: {tokenId: desc},
        limit: 200
        ) {
        tokenId,
        contentURI,
        metadata {
            json
        }
    }
}
`;

const client = createClient({
  url: APIURL,
});

function List(props: Props) {
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  return (
    <>
      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />

      <Layout
        showWalletOptions={showWalletOptions}
        setShowWalletOptions={setShowWalletOptions}
      >
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 overflow-hidden sm:py-24 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {props.tokens.map((token: Token, index: number) => {
                return (
                  <>
                    {token &&
                      token.metadata.json &&
                      token.metadata.json.mimeType.includes("audio") && (
                        <a
                          key={index}
                          href={`/media/${token.tokenId}`}
                          className="group text-sm"
                        >
                          <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 group-hover:opacity-75">
                            <img
                              src="https://source.unsplash.com/ojBNiaeykwc/400x400"
                              alt="placeholder"
                              className="w-full h-full object-center object-cover"
                            />
                          </div>
                          <h3 className="mt-4 font-medium text-gray-900">
                            {token.metadata.json.name || "Untitled"}
                          </h3>
                          <p className="text-gray-500 italic">
                            {`${token.metadata.json.description.substring(
                              0,
                              45
                            )}...` || "No description"}
                          </p>
                        </a>
                      )}
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

async function fetchData() {
  let data = await client.query(mediasQuery).toPromise();
  return data.data.Media;
}

export async function getServerSideProps() {
  const data = await fetchData().catch((err) => {
    console.error(err);
    return [];
  });
  return {
    props: {
      tokens: data,
    },
  };
}

export default List;
