/*
 *
 * PrinterUtils (printer-utils.js)
 * Author: rtfpessoa
 *
 */


var separator = '/';

function PrinterUtils() {}

PrinterUtils.prototype.separatePrefix = function(isCombined, line) {
  var prefix;
  var lineWithoutPrefix;

  if (isCombined) {
    prefix = line.substring(0, 2);
    lineWithoutPrefix = line.substring(2);
  } else {
    prefix = line.substring(0, 1);
    lineWithoutPrefix = line.substring(1);
  }

  return {'prefix': prefix, 'line': lineWithoutPrefix};
};

PrinterUtils.prototype.getHtmlId = function(file) {
  var hashCode = function(text) {
    var i, chr, len;
    var hash = 0;

    for (i = 0, len = text.length; i < len; i++) {
      chr = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;  // Convert to 32bit integer
    }

    return hash;
  };

  return 'd2h-' + hashCode(this.getDiffName(file)).toString().slice(-6);
};

PrinterUtils.prototype.getDiffName = function(file) {
  var oldFilename = unifyPath(file.oldName);
  var newFilename = unifyPath(file.newName);

  if (oldFilename && newFilename && oldFilename !== newFilename && !isDevNullName(oldFilename) &&
      !isDevNullName(newFilename)) {
    var prefixPaths = [];
    var suffixPaths = [];

    var oldFilenameParts = oldFilename.split(separator);
    var newFilenameParts = newFilename.split(separator);

    var oldFilenamePartsSize = oldFilenameParts.length;
    var newFilenamePartsSize = newFilenameParts.length;

    var i = 0;
    var j = oldFilenamePartsSize - 1;
    var k = newFilenamePartsSize - 1;

    while (i < j && i < k) {
      if (oldFilenameParts[i] === newFilenameParts[i]) {
        prefixPaths.push(newFilenameParts[i]);
        i += 1;
      } else {
        break;
      }
    }

    while (j > i && k > i) {
      if (oldFilenameParts[j] === newFilenameParts[k]) {
        suffixPaths.unshift(newFilenameParts[k]);
        j -= 1;
        k -= 1;
      } else {
        break;
      }
    }

    var finalPrefix = prefixPaths.join(separator);
    var finalSuffix = suffixPaths.join(separator);

    var oldRemainingPath = oldFilenameParts.slice(i, j + 1).join(separator);
    var newRemainingPath = newFilenameParts.slice(i, k + 1).join(separator);

    if (finalPrefix.length && finalSuffix.length) {
      return finalPrefix + separator + '{' + oldRemainingPath + ' → ' + newRemainingPath + '}' +
          separator + finalSuffix;
    } else if (finalPrefix.length) {
      return finalPrefix + separator + '{' + oldRemainingPath + ' → ' + newRemainingPath + '}';
    } else if (finalSuffix.length) {
      return '{' + oldRemainingPath + ' → ' + newRemainingPath + '}' + separator + finalSuffix;
    }

    return oldFilename + ' → ' + newFilename;
  } else if (newFilename && !isDevNullName(newFilename)) {
    return newFilename;
  } else if (oldFilename) {
    return oldFilename;
  }

  return 'unknown/file/path';
};

function unifyPath(path) {
  if (path) {
    return path.replace('\\', '/');
  }

  return path;
}

function isDevNullName(name) {
  return name.indexOf('dev/null') !== -1;
}

export const printerUtils = new PrinterUtils();
