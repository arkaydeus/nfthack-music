import { createClient } from "urql";
import { useState, useEffect } from "react";

const APIURL = "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1";
const mediasQuery = `
query {
  medias(
    orderBy: createdAtTimestamp, 
    orderDirection: desc,
    first: 10
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

export default function Home(props) {
  return (
    <div className="grid grid-cols-4 gap-4 px-10 py-10">
      {props.tokens.map((token) => {
        return (
          <div
            className="shadow-lg bg-transparent rounded-2xl overflow-hidden"
            key={token.contentURI}
          >
            <div className="w-100% h-100%">
              {/* {token.type === "image" && (
                <div style={{ height: "320px", overflow: "hidden" }}>
                  <img
                    style={{ minHeight: "320px" }}
                    src={ipfsToURL(token.contentURI.split("/").pop())}
                  />
                </div>
              )}
              {token.type === "video" && (
                <div className="relative">
                  <div
                    style={{
                      width: "288px",
                      height: "320px",
                      boxSizing: "border-box",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                    }}
                  >
                    <video
                      height="auto"
                      controls
                      autoPlay
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "cover",
                      }}
                    >
                      <source
                        src={ipfsToURL(token.contentURI.split("/").pop())}
                      />
                    </video>
                  </div>
                </div>
              )} */}
              {token.type === "audio" && (
                <audio controls>
                  <source
                    src={ipfsToURL(token.contentURI.split("/").pop())}
                    type="audio/ogg"
                  />
                  <source
                    src={ipfsToURL(token.contentURI.split("/").pop())}
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
              )}
              <div className="px-2 pt-2 pb-10">
                <h3
                  style={{ height: 100 }}
                  className="text-2xl p-4 pt-6 font-semibold"
                >
                  {token.meta.name}
                </h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ipfsToURL(ipfsHash) {
  return `https://ipfs.io/ipfs/${ipfsHash}`;
}

async function fetchData() {
  let data = await client.query(mediasQuery).toPromise();
  let tokenData = await Promise.all(
    data.data.medias.map(async (token) => {
      let meta;
      try {
        const ipfsHash = token.metadataURI.split("/").pop();
        const metaData = await fetch(ipfsToURL(ipfsHash));
        let response = await metaData.json();
        meta = response;
      } catch (err) {
        console.error(err);
        return;
      }
      if (!meta) return;
      if (meta.mimeType.includes("mp4")) {
        token.type = "video";
      } else if (meta.mimeType.includes("wav")) {
        token.type = "audio";
      } else {
        token.type = "image";
      }
      token.meta = meta;
      return token;
    })
  );
  return tokenData;
}

export async function getServerSideProps() {
  const data = await fetchData();
  return {
    props: {
      tokens: data,
    },
  };
}
