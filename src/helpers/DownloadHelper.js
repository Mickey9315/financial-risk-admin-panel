export const downloadAll = urls => {
  console.log({ urls });
  const link = document.createElement('a');

  link.setAttribute('download', null);
  link.setAttribute('target', '__blank');
  link.style.display = 'none';

  document.body.appendChild(link);

  urls.forEach(url => {
    link.setAttribute('href', url);
    link.click();
  });

  // document.body.removeChild(link);
};
