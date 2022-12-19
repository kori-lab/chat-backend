import hermes from "@kori_xyz/hermes";

export default function IPLookup(ip) {
  return new Promise(async (resolve) => {
    const { data } = await hermes.get({
      url: `http://ip-api.com/json/${ip}?fields=258047`,
    });

    resolve(data);
  });
}
