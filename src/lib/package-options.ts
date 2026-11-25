interface PackagePrice { price: string; priceForTwo?: string }
interface GuestLabels { forOne: string; forTwo: string }

export function getPackageOptions(pkg: PackagePrice, title: string, labels: GuestLabels) {
  if (!pkg.priceForTwo) return [{ name: title, label: '', price: pkg.price }];
  return [
    { name: `${title} — ${labels.forOne}`, label: labels.forOne, price: pkg.price },
    { name: `${title} — ${labels.forTwo}`, label: labels.forTwo, price: pkg.priceForTwo },
  ];
}
