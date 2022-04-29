import { pre } from './check/precondition/Pre.ts';
import {
  asyncProperty,
  IAsyncProperty,
  IAsyncPropertyWithHooks,
  AsyncPropertyHookFunction,
} from './check/property/AsyncProperty.ts';
import { property, IProperty, IPropertyWithHooks, PropertyHookFunction } from './check/property/Property.ts';
import { IRawProperty } from './check/property/IRawProperty.ts';
import { Parameters } from './check/runner/configuration/Parameters.ts';
import {
  RunDetails,
  RunDetailsFailureProperty,
  RunDetailsFailureTooManySkips,
  RunDetailsFailureInterrupted,
  RunDetailsSuccess,
  RunDetailsCommon,
} from './check/runner/reporter/RunDetails.ts';
import { assert, check } from './check/runner/Runner.ts';
import { sample, statistics } from './check/runner/Sampler.ts';

import { array, ArrayConstraints } from './arbitrary/array.ts';
import { bigInt, BigIntConstraints } from './arbitrary/bigInt.ts';
import { bigIntN } from './arbitrary/bigIntN.ts';
import { bigUint, BigUintConstraints } from './arbitrary/bigUint.ts';
import { bigUintN } from './arbitrary/bigUintN.ts';
import { boolean } from './arbitrary/boolean.ts';
import { falsy, FalsyContraints, FalsyValue } from './arbitrary/falsy.ts';
import { ascii } from './arbitrary/ascii.ts';
import { base64 } from './arbitrary/base64.ts';
import { char } from './arbitrary/char.ts';
import { char16bits } from './arbitrary/char16bits.ts';
import { fullUnicode } from './arbitrary/fullUnicode.ts';
import { hexa } from './arbitrary/hexa.ts';
import { unicode } from './arbitrary/unicode.ts';
import { clonedConstant } from './arbitrary/clonedConstant.ts';
import { constant } from './arbitrary/constant.ts';
import { constantFrom } from './arbitrary/constantFrom.ts';
import { context, ContextValue } from './arbitrary/context.ts';
import { date } from './arbitrary/date.ts';
import { clone, CloneValue } from './arbitrary/clone.ts';
import { dedup, DedupValue } from './arbitrary/dedup.ts';
import { Arbitrary } from './check/arbitrary/definition/Arbitrary.ts';
import { Shrinkable } from './check/arbitrary/definition/Shrinkable.ts';
import { dictionary, DictionaryConstraints } from './arbitrary/dictionary.ts';
import { emailAddress, EmailAddressConstraints } from './arbitrary/emailAddress.ts';
import { double, DoubleConstraints } from './arbitrary/double.ts';
import { float, FloatConstraints } from './arbitrary/float.ts';
import { frequency, WeightedArbitrary, FrequencyValue, FrequencyContraints } from './arbitrary/frequency.ts';
import { compareBooleanFunc } from './arbitrary/compareBooleanFunc.ts';
import { compareFunc } from './arbitrary/compareFunc.ts';
import { func } from './arbitrary/func.ts';
import { domain, DomainConstraints } from './arbitrary/domain.ts';
import { integer, IntegerConstraints } from './arbitrary/integer.ts';
import { maxSafeInteger } from './arbitrary/maxSafeInteger.ts';
import { maxSafeNat } from './arbitrary/maxSafeNat.ts';
import { nat, NatConstraints } from './arbitrary/nat.ts';
import { ipV4 } from './arbitrary/ipV4.ts';
import { ipV4Extended } from './arbitrary/ipV4Extended.ts';
import { ipV6 } from './arbitrary/ipV6.ts';
import { letrec } from './arbitrary/letrec.ts';
import { lorem, LoremConstraints } from './arbitrary/lorem.ts';
import { mapToConstant } from './arbitrary/mapToConstant.ts';
import { memo, Memo } from './arbitrary/memo.ts';
import { mixedCase, MixedCaseConstraints } from './arbitrary/mixedCase.ts';
import { object, ObjectConstraints } from './arbitrary/object.ts';
import { json, JsonSharedConstraints } from './arbitrary/json.ts';
import { anything } from './arbitrary/anything.ts';
import { unicodeJsonObject } from './arbitrary/unicodeJsonObject.ts';
import { unicodeJsonValue } from './arbitrary/unicodeJsonValue.ts';
import { jsonObject } from './arbitrary/jsonObject.ts';
import { jsonValue, JsonValue } from './arbitrary/jsonValue.ts';
import { unicodeJson } from './arbitrary/unicodeJson.ts';
import { oneof, OneOfValue, OneOfConstraints } from './arbitrary/oneof.ts';
import { option, OptionConstraints } from './arbitrary/option.ts';
import { record, RecordConstraints, RecordValue } from './arbitrary/record.ts';
import { set, SetConstraints, SetConstraintsSelector } from './arbitrary/set.ts';
import {
  uniqueArray,
  UniqueArrayConstraints,
  UniqueArraySharedConstraints,
  UniqueArrayConstraintsRecommended,
  UniqueArrayConstraintsCustomCompare,
  UniqueArrayConstraintsCustomCompareSelect,
} from './arbitrary/uniqueArray.ts';
import { infiniteStream } from './arbitrary/infiniteStream.ts';
import { asciiString } from './arbitrary/asciiString.ts';
import { base64String } from './arbitrary/base64String.ts';
import { fullUnicodeString } from './arbitrary/fullUnicodeString.ts';
import { hexaString } from './arbitrary/hexaString.ts';
import { string, StringSharedConstraints } from './arbitrary/string.ts';
import { string16bits } from './arbitrary/string16bits.ts';
import { stringOf } from './arbitrary/stringOf.ts';
import { unicodeString } from './arbitrary/unicodeString.ts';
import { subarray, SubarrayConstraints } from './arbitrary/subarray.ts';
import { shuffledSubarray, ShuffledSubarrayConstraints } from './arbitrary/shuffledSubarray.ts';
import { genericTuple } from './arbitrary/genericTuple.ts';
import { tuple } from './arbitrary/tuple.ts';
import { uuid } from './arbitrary/uuid.ts';
import { uuidV } from './arbitrary/uuidV.ts';
import { webAuthority, WebAuthorityConstraints } from './arbitrary/webAuthority.ts';
import { webFragments, WebFragmentsConstraints } from './arbitrary/webFragments.ts';
import { webQueryParameters, WebQueryParametersConstraints } from './arbitrary/webQueryParameters.ts';
import { webSegment, WebSegmentConstraints } from './arbitrary/webSegment.ts';
import { webUrl, WebUrlConstraints } from './arbitrary/webUrl.ts';

import { AsyncCommand } from './check/model/command/AsyncCommand.ts';
import { Command } from './check/model/command/Command.ts';
import { ICommand } from './check/model/command/ICommand.ts';
import { commands } from './arbitrary/commands.ts';
import {
  asyncModelRun,
  modelRun,
  scheduledModelRun,
  ModelRunSetup,
  ModelRunAsyncSetup,
} from './check/model/ModelRunner.ts';

import { Random } from './random/generator/Random.ts';

import {
  configureGlobal,
  GlobalParameters,
  GlobalAsyncPropertyHookFunction,
  GlobalPropertyHookFunction,
  readConfigureGlobal,
  resetConfigureGlobal,
} from './check/runner/configuration/GlobalParameters.ts';
import { VerbosityLevel } from './check/runner/configuration/VerbosityLevel.ts';
import { ExecutionStatus } from './check/runner/reporter/ExecutionStatus.ts';
import { ExecutionTree } from './check/runner/reporter/ExecutionTree.ts';
import { cloneMethod, cloneIfNeeded, hasCloneMethod, WithCloneMethod } from './check/symbols.ts';
import { Stream, stream } from './stream/Stream.ts';
import { hash } from './utils/hash.ts';
import {
  stringify,
  asyncStringify,
  toStringMethod,
  hasToStringMethod,
  WithToStringMethod,
  asyncToStringMethod,
  hasAsyncToStringMethod,
  WithAsyncToStringMethod,
} from './utils/stringify.ts';
import {
  scheduler,
  schedulerFor,
  Scheduler,
  SchedulerSequenceItem,
  SchedulerReportItem,
  SchedulerConstraints,
} from './arbitrary/scheduler.ts';
import { defaultReportMessage, asyncDefaultReportMessage } from './check/runner/utils/RunDetailsFormatter.ts';
import { ArbitraryWithShrink } from './check/arbitrary/definition/ArbitraryWithShrink.ts';
import { ArbitraryWithContextualShrink } from './check/arbitrary/definition/ArbitraryWithContextualShrink.ts';
import { CommandsContraints } from './check/model/commands/CommandsContraints.ts';
import { PreconditionFailure } from './check/precondition/PreconditionFailure.ts';
import { RandomType } from './check/runner/configuration/RandomType.ts';
import { FloatNextConstraints } from './arbitrary/_next/floatNext.ts';
import { int8Array, IntArrayConstraints } from './arbitrary/int8Array.ts';
import { int16Array } from './arbitrary/int16Array.ts';
import { int32Array } from './arbitrary/int32Array.ts';
import { uint8Array } from './arbitrary/uint8Array.ts';
import { uint8ClampedArray } from './arbitrary/uint8ClampedArray.ts';
import { uint16Array } from './arbitrary/uint16Array.ts';
import { uint32Array } from './arbitrary/uint32Array.ts';
import { float32Array, Float32ArrayConstraints } from './arbitrary/float32Array.ts';
import { float64Array, Float64ArrayConstraints } from './arbitrary/float64Array.ts';
import { sparseArray, SparseArrayConstraints } from './arbitrary/sparseArray.ts';
import { DoubleNextConstraints } from './arbitrary/_next/doubleNext.ts';
import { NextArbitrary } from './check/arbitrary/definition/NextArbitrary.ts';
import { NextValue } from './check/arbitrary/definition/NextValue.ts';
import { convertFromNext, convertFromNextWithShrunkOnce, convertToNext } from './check/arbitrary/definition/Converters.ts';
import { PureRandom } from './random/generator/PureRandom.ts';
import {
  Size,
  SizeForArbitrary,
  DepthFactorSizeForArbitrary,
} from './arbitrary/_internals/helpers/MaxLengthFromMinLength.ts';
import {
  createDepthIdentifier,
  DepthContext,
  DepthIdentifier,
  getDepthContextFor,
} from './arbitrary/_internals/helpers/DepthContext.ts';

// Explicit cast into string to avoid to have __type: "__PACKAGE_TYPE__"
/**
 * Type of module (commonjs or module)
 * @remarks Since 1.22.0
 * @public
 */
const __type = '__PACKAGE_TYPE__' as string;
/**
 * Version of fast-check used by your project (eg.: __PACKAGE_VERSION__)
 * @remarks Since 1.22.0
 * @public
 */
const __version = '__PACKAGE_VERSION__' as string;
/**
 * Commit hash of the current code (eg.: __COMMIT_HASH__)
 * @remarks Since 2.7.0
 * @public
 */
const __commitHash = '__COMMIT_HASH__' as string;

/**
 * @deprecated Switch to {@link ContextValue} instead
 * @remarks Since 1.8.0
 * @public
 */
type Context = ContextValue;

/**
 * @deprecated Switch to {@link FalsyValue} instead
 * @remarks Since 1.26.0
 * @public
 */
type FalsyType = FalsyValue;

// boolean
// floating point types
// integer types
// single character
// strings
// combination of others
// complex combinations
export {
  // meta
  __type,
  __version,
  __commitHash,
  // assess the property
  sample,
  statistics,
  // check the property
  check,
  assert,
  // pre conditions
  pre,
  PreconditionFailure,
  // property definition
  property,
  asyncProperty,
  IRawProperty,
  IProperty,
  IPropertyWithHooks,
  IAsyncProperty,
  IAsyncPropertyWithHooks,
  AsyncPropertyHookFunction,
  PropertyHookFunction,
  // pre-built arbitraries
  boolean,
  falsy,
  float,
  double,
  integer,
  nat,
  maxSafeInteger,
  maxSafeNat,
  bigIntN,
  bigUintN,
  bigInt,
  bigUint,
  char,
  ascii,
  char16bits,
  unicode,
  fullUnicode,
  hexa,
  base64,
  mixedCase,
  string,
  asciiString,
  string16bits,
  stringOf,
  unicodeString,
  fullUnicodeString,
  hexaString,
  base64String,
  lorem,
  constant,
  constantFrom,
  clonedConstant,
  mapToConstant,
  option,
  oneof,
  frequency,
  clone,
  dedup,
  shuffledSubarray,
  subarray,
  array,
  sparseArray,
  infiniteStream,
  set,
  uniqueArray,
  tuple,
  genericTuple,
  record,
  dictionary,
  anything,
  object,
  json,
  jsonObject,
  jsonValue,
  unicodeJson,
  unicodeJsonObject,
  unicodeJsonValue,
  letrec,
  memo,
  compareBooleanFunc,
  compareFunc,
  func,
  context,
  date,
  // web
  ipV4,
  ipV4Extended,
  ipV6,
  domain,
  webAuthority,
  webSegment,
  webFragments,
  webQueryParameters,
  webUrl,
  emailAddress,
  uuid,
  uuidV,
  int8Array,
  uint8Array,
  uint8ClampedArray,
  int16Array,
  uint16Array,
  int32Array,
  uint32Array,
  float32Array,
  float64Array,
  // model-based
  AsyncCommand,
  Command,
  ICommand,
  asyncModelRun,
  modelRun,
  scheduledModelRun,
  commands,
  ModelRunSetup,
  ModelRunAsyncSetup,
  // scheduler
  scheduler,
  schedulerFor,
  Scheduler,
  SchedulerSequenceItem,
  SchedulerReportItem,
  // extend the framework
  Arbitrary,
  NextArbitrary,
  ArbitraryWithShrink,
  ArbitraryWithContextualShrink,
  Shrinkable,
  NextValue,
  cloneMethod,
  cloneIfNeeded,
  hasCloneMethod,
  WithCloneMethod,
  convertFromNext,
  convertFromNextWithShrunkOnce,
  convertToNext,
  toStringMethod,
  hasToStringMethod,
  WithToStringMethod,
  asyncToStringMethod,
  hasAsyncToStringMethod,
  WithAsyncToStringMethod,
  DepthContext,
  getDepthContextFor,
  // print values
  stringify,
  asyncStringify,
  defaultReportMessage,
  asyncDefaultReportMessage,
  hash,
  // constraints
  ArrayConstraints,
  BigIntConstraints,
  BigUintConstraints,
  CommandsContraints,
  DictionaryConstraints,
  DomainConstraints,
  DoubleConstraints,
  DoubleNextConstraints,
  EmailAddressConstraints,
  FalsyContraints,
  Float32ArrayConstraints,
  Float64ArrayConstraints,
  FloatConstraints,
  FloatNextConstraints,
  FrequencyContraints,
  IntArrayConstraints,
  IntegerConstraints,
  JsonSharedConstraints,
  LoremConstraints,
  MixedCaseConstraints,
  NatConstraints,
  ObjectConstraints,
  OneOfConstraints,
  OptionConstraints,
  RecordConstraints,
  SchedulerConstraints,
  SetConstraints,
  SetConstraintsSelector,
  UniqueArrayConstraints,
  UniqueArraySharedConstraints,
  UniqueArrayConstraintsRecommended,
  UniqueArrayConstraintsCustomCompare,
  UniqueArrayConstraintsCustomCompareSelect,
  SparseArrayConstraints,
  StringSharedConstraints,
  SubarrayConstraints,
  ShuffledSubarrayConstraints,
  WebAuthorityConstraints,
  WebFragmentsConstraints,
  WebQueryParametersConstraints,
  WebSegmentConstraints,
  WebUrlConstraints,
  WeightedArbitrary,
  // produced values
  CloneValue,
  ContextValue,
  DedupValue,
  FalsyValue,
  FrequencyValue,
  JsonValue,
  OneOfValue,
  RecordValue,
  // arbitrary types (mostly when produced values are difficult to formalize)
  Memo,
  // run configuration
  Size,
  SizeForArbitrary,
  DepthFactorSizeForArbitrary,
  GlobalParameters,
  GlobalAsyncPropertyHookFunction,
  GlobalPropertyHookFunction,
  Parameters,
  RandomType,
  VerbosityLevel,
  configureGlobal,
  readConfigureGlobal,
  resetConfigureGlobal,
  // run output
  ExecutionStatus,
  ExecutionTree,
  RunDetails,
  RunDetailsFailureProperty,
  RunDetailsFailureTooManySkips,
  RunDetailsFailureInterrupted,
  RunDetailsSuccess,
  RunDetailsCommon,
  // various utils
  PureRandom,
  Random,
  Stream,
  stream,
  DepthIdentifier,
  createDepthIdentifier,
  // depreciated
  Context,
  FalsyType,
};
