/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
  var i = 0, j = str.length - 1;
  while (i <= j) {
    if (!isAlphabetic(str[i])) {
      i++;
      continue;
    }
    if (!isAlphabetic(str[j])) {
      j--;
      continue;
    }
    if (str[i].toLowerCase() != str[j].toLowerCase()) {
      return false;
    }
    i++;
    j--;
  }
  return true;
}

function isAlphabetic(char) {
  return /[a-zA-Z]/.test(char);
}

module.exports = isPalindrome;