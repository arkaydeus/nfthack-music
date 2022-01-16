import { useState } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance } from "wagmi";
import { Layout, WalletOptionsModal } from "../components";
import { createClient } from "urql";
import {deleteUndefined, toValidHTTPSURI} from "../utils/helpers";

interface MediaQuery {
    id: string;
    contentURI: string;
    metadataURI: string;
}

interface Description {
    name: string;
    description: string;
}

interface Token {
    id: string;
    contentURI: string;
    metadataURI: string;
    meta: Description;
    type: string;
}

interface Props {
    tokens: Token[];
}

const APIURL = "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1";
const mediasQuery = `
query {
  medias(
    orderBy: createdAtTimestamp, 
    orderDirection: desc,
    first: 200
    ) {
    id,
    metadataURI,
    contentURI
  }
}
`;

const client = createClient({
    url: APIURL,
});


const Home: NextPage = (props: Props) => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [{ data: accountData, loading: accountLoading }] = useAccount();
  const [{ data: balanceData, loading: balanceLoading }] = useBalance({
    addressOrName: accountData?.address,
    watch: true,
  });

  const loading = (accountLoading || balanceLoading) && !balanceData;

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
                      {props.tokens.map((token: Token) => {
                          // const contentURI = toValidHTTPSURI(token.contentURI);
                          return (
                              <>
                                  {token && token.type === "audio" && (
                                      <a
                                          key={token.contentURI}
                                          href={`/media/${token.id}`}
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
                                              {token.meta.name || "Untitled"}
                                          </h3>
                                          <p className="text-gray-500 italic">
                                              {`${token.meta.description.substring(0, 45)}...` || "No description"}
                                          </p>
                                          {/* <p className="mt-2 font-medium text-gray-900">
                      {token.price}
                    </p> */}
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
};


async function fetchData() {
    let data = await client.query(mediasQuery).toPromise();
    let tokenData = await Promise.all(
        data.data.medias.map(async (media: MediaQuery) => {
            let meta;
            let token: Token = {
                id: media.id,
                contentURI: media.contentURI,
                metadataURI: media.metadataURI,
                meta: {
                    name: "",
                    description: "",
                },
                type: "",
            };
            try {
                const metaData = await fetch(toValidHTTPSURI(media.metadataURI));
                let response
                if (media.metadataURI.includes("arweave")) {
                    const jsonText = await metaData.text()
                    response = JSON.parse(jsonText);
                } else {
                    response = (await metaData.json()) || null;
                }
                meta = response;
            } catch (err) {
                console.log("broke here");
                console.error(err);
                return;
            }
            if (!meta || !meta.mimeType) return;
            if (
                meta.mimeType.includes("audio") ||
                meta.mimeType.includes("wav") ||
                meta.mimeType.includes("mp3")
            ) {
                token.type = "audio";
            } else {
                return;
            }
            token.meta = meta;
            return token;
        })
    );
    return tokenData;
}

export async function getServerSideProps() {
    const data = await fetchData().catch((err) => {
        console.log("broke calling fetchData");
        console.error(err.message);
        console.error(err);
        return [];
    });
    deleteUndefined(data);
    return {
        props: {
            tokens: data,
        },
    };
}

export default Home;
