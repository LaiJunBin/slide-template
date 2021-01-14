console.stdlog = console.log.bind(console);
console.logs = [];
console.log = function () {
    console.logs.push(Array.from(arguments).map(arg => {
        if (arg instanceof Object && !(arg instanceof Array)) {
            if (arg.constructor.name !== 'Object') {
                return arg.toString();
            }
            return `{${Object.keys(arg).map(k => [k, arg[k] instanceof Function ? 'f' : arg[k]].join(': ')).join(', ')}}`;
        }
        return arg;
    }).join(' '));
    console.stdlog.apply(console, arguments);
}