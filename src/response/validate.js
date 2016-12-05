const R = require('ramda')

const types = require('../constants/types')
const severities = require('../constants/severities')

const DEPENDENT_ON_REQUIRED_TYPES = [types.INFRASTRUCTURE, types.INTERNAL_DEPENDENCY, types.EXTERNAL_DEPENDENCY]

const notEmpty = R.compose(R.not, R.isEmpty)
const validateName = R.allPass([R.is(String), notEmpty])
const validateMessage = R.allPass([R.is(String), notEmpty])
const validateHealthy = R.is(Boolean)
const validateType = R.curry(R.contains)(R.__, R.keys(types))
const validateSeverity = R.curry(R.contains)(R.__, R.keys(severities))

const validateDependentOn = (type) => R.contains(type, DEPENDENT_ON_REQUIRED_TYPES)
  ? R.allPass([R.is(String), R.compose(R.not, R.isEmpty)])
  : R.isNil

module.exports = (
  name,
  healthy,
  actionable,
  type,
  severity,
  message,
  dependentOn,
  info,
  link
) => {
  if (!validateHealthy(healthy)) {
    return false
  }

  if (healthy) {
    return validateName(name) &&
           validateType(type) &&
           R.is(Boolean)(actionable) &&
           R.isNil(dependentOn) &&
           R.isNil(severity)
  }

  return validateSeverity(severity) &&
         validateDependentOn(type)(dependentOn) &&
         validateMessage(message)
}