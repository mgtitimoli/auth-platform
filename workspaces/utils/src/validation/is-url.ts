const isUrl = (str: string) => {
  try {
    new URL(str);

    return str.startsWith("http://") || str.startsWith("https://");
  } catch {
    return false;
  }
};

export {isUrl};
