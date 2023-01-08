export const variantSize = (variant) => {
  const [, size] = variant.split(" - ");

  return size ? size : "One option";
};
