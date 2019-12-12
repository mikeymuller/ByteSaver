export class Matcher {

    longestPrefixMatch(list, target) {
        if (target.length == 0) {
            return list[0];
        }
        let next = [];
        list.forEach((item) => {
            if (typeof item[0] !== 'undefined' && item[0] == target[0]) {
                next.push(item.substr(1));
            }
        });
        if (next.length == 0) {
            return list[0];
        } else {
            return longestPrefixMatch(next, target.substr(1));
        }
    }
}

