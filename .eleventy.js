const config = require('@andystevenson/lib/11ty')
const lodash = require('lodash')
const _ = [
  // lodash String functions
  'camelCase',
  'capitalize',
  'deburr',
  'escape',
  'escapeRegExp',
  'kebabCase',
  'lowerCase',
  'lowerFirst',
  'pad',
  'padEnd',
  'padStart',
  'parseInt',
  'repeat',
  'replace',
  'snakeCase',
  'split',
  'startCase',
  'startsWith',
  'template',
  'toLower',
  'toUpper',
  'trim',
  'trimEnd',
  'trimStart',
  'truncate',
  'unescape',
  'upperCase',
  'upperFirst',
  'words',
  // Util
  'attempt',
  'bindAll',
  'cond',
  'conforms',
  'constant',
  'defaultTo',
  'flow',
  'flowRight',
  'identity',
  'iteratee',
  'matches',
  'matchesProperty',
  'method',
  'methodOf',
  'mixin',
  'noConflict',
  'noop',
  'nthArg',
  'over',
  'overEvery',
  'overSome',
  'property',
  'propertyOf',
  'range',
  'rangeRight',
  'runInContext',
  'stubArray',
  'stubFalse',
  'stubObject',
  'stubString',
  'stubTrue',
  'times',
  'toPath',
  'uniqueId',
  // Object
  'assign',
  'assignIn',
  'assignInWith',
  'assignWith',
  'at',
  'create',
  'defaults',
  'defaultsDeep',
  'entries',
  'entriesIn',
  'extend',
  'extendWith',
  'findKey',
  'findLastKey',
  'forIn',
  'forInRight',
  'forOwn',
  'forOwnRight',
  'functions',
  'functionsIn',
  'get',
  'has',
  'hasIn',
  'invert',
  'invertBy',
  'invoke',
  'keys',
  'keysIn',
  'mapKeys',
  'mapValues',
  'merge',
  'mergeWith',
  'omit',
  'omitBy',
  'pick',
  'pickBy',
  'result',
  'set',
  'setWith',
  'toPairs',
  'toPairsIn',
  'transform',
  'unset',
  'update',
  'updateWith',
  'values',
  'valuesIn',
  // Number
  'clamp',
  'inRange',
  'random',
  // Math
  'add',
  'ceil',
  'divide',
  'floor',
  'max',
  'maxBy',
  'mean',
  'meanBy',
  'min',
  'minBy',
  'multiply',
  'round',
  'subtract',
  'sum',
  'sumBy',
  // Lang
  'castArray',
  'clone',
  'cloneDeep',
  'cloneDeepWith',
  'cloneWith',
  'conformsTo',
  'eq',
  'gt',
  'gte',
  'isArguments',
  'isArray',
  'isArrayBuffer',
  'isArrayLike',
  'isArrayLikeObject',
  'isBoolean',
  'isBuffer',
  'isDate',
  'isElement',
  'isEmpty',
  'isEqual',
  'isEqualWith',
  'isError',
  'isFinite',
  'isFunction',
  'isInteger',
  'isLength',
  'isMap',
  'isMatch',
  'isMatchWith',
  'isNaN',
  'isNative',
  'isNil',
  'isNull',
  'isNumber',
  'isObject',
  'isObjectLike',
  'isPlainObject',
  'isRegExp',
  'isSafeInteger',
  'isSet',
  'isString',
  'isSymbol',
  'isTypedArray',
  'isUndefined',
  'isWeakMap',
  'isWeakSet',
  'lt',
  'lte',
  'toArray',
  'toFinite',
  'toInteger',
  'toLength',
  'toNumber',
  'toPlainObject',
  'toSafeInteger',
  'toString',

  // Function
  'after',
  'ary',
  'before',
  'bind',
  'bindKey',
  'curry',
  'curryRight',
  'debounce',
  'defer',
  'delay',
  'flip',
  'memoize',
  'negate',
  'once',
  'overArgs',
  'partial',
  'partialRight',
  'rearg',
  'rest',
  'spread',
  'throttle',
  'unary',
  'wrap',
  // Date
  'now',
  // Collection
  'countBy',
  'each',
  'eachRight',
  'every',
  'filter',
  'find',
  'findLast',
  'flatMap',
  'flatMapDeep',
  'flatMapDepth',
  'forEach',
  'forEachRight',
  'groupBy',
  'includes',
  'invokeMap',
  'keyBy',
  'map',
  'orderBy',
  'partition',
  'reduce',
  'reduceRight',
  'reject',
  'sample',
  'sampleSize',
  'shuffle',
  'size',
  'some',
  'sortBy',
  // Array
  'chunk',
  'compact',
  'concat',
  'difference',
  'differenceBy',
  'differenceWith',
  'drop',
  'dropRight',
  'dropRightWhile',
  'dropWhile',
  'fill',
  'findIndex',
  'findLastIndex',
  'first',
  'flatten',
  'flattenDeep',
  'flattenDepth',
  'fromPairs',
  'head',
  'indexOf',
  'initial',
  'intersection',
  'intersectionBy',
  'intersectionWith',
  'join',
  'last',
  'lastIndexOf',
  'nth',
  'pull',
  'pullAll',
  'pullAllBy',
  'pullAllWith',
  'pullAt',
  'remove',
  'reverse',
  'slice',
  'sortedIndex',
  'sortedIndexBy',
  'sortedIndexOf',
  'sortedLastIndex',
  'sortedLastIndexBy',
  'sortedLastIndexOf',
  'sortedUniq',
  'sortedUniqBy',
  'tail',
  'take',
  'takeRight',
  'takeRightWhile',
  'takeWhile',
  'union',
  'unionBy',
  'unionWith',
  'uniq',
  'uniqBy',
  'uniqWith',
  'unzip',
  'unzipWith',
  'without',
  'xor',
  'xorBy',
  'xorWith',
  'zip',
  'zipObject',
  'zipObjectDeep',
  'zipWith',
].reduce((methods, method) => {
  const exists = method in lodash
  const isFunction = exists ? typeof lodash[method] === 'function' : true

  if (exists && isFunction) {
    methods[method] = lodash[method]
    return methods
  }

  !exists && console.log(`${method} is not a property of lodash`)
  !isFunction && console.log(`${method} is not a function of lodash`)
  return methods
}, {})

const util = require('node:util')
const inspect = function (object, ...args) {
  console.log(util.inspect(object, undefined, null, true))
  args.forEach((arg) => console.log(util.inspect(arg, undefined, null, true)))
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter('inspect', inspect)

  for (const method in _) {
    eleventyConfig.addFilter(method, _[method])
  }

  eleventyConfig.addGlobalData('_', _)

  const newConfig = config(eleventyConfig)

  return newConfig
}
