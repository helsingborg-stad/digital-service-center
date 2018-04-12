
const invalidTypes = ['information'];

export default function (result) {
  return result.reduce((acc, val) => {
    if (!val || !val.address || !val.address.road) {
      return acc;
    }

    if (invalidTypes.includes(val.type)) {
      return acc;
    }

    const key = !val.address.house_number
      ? val.address.road
      : `${val.address.road} ${val.address.house_number}`;

    if (!acc.some(x => x.address === key)) {
      acc.push({
        address: key,
        lat: parseFloat(val.lat),
        lng: parseFloat(val.lon)
      });
    }

    return acc;
  }, []);
}
