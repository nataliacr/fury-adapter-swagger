import _ from 'lodash';

function escapeUriTemplateVariable(variable) {
  return encodeURIComponent(variable)
    .replace(/[-.!~*'()]/g, c => `%${c.charCodeAt(0).toString(16)}`);
}

export default function buildUriTemplate(basePath, href, pathObjectParams = [], queryParams = []) {
  const parameterNames = _.chain(pathObjectParams)
    .concat(queryParams)
    .filter(parameter => parameter.in === 'query')
    .uniqBy(parameter => parameter.name)
    .map((parameter) => {
      const name = escapeUriTemplateVariable(parameter.name);

      if (parameter.collectionFormat === 'multi') {
        return `${name}*`;
      }

      return name;
    })
    .value();

  if (parameterNames.length > 0) {
    const queryString = parameterNames.join(',');
    return `${basePath}${href}{?${queryString}}`;
  }

  return basePath + href;
}
