import { Arbitrary } from '../../../check/arbitrary/definition/Arbitrary.ts';
import { Size } from '../helpers/MaxLengthFromMinLength.ts';
import { convertFromNext, convertToNext } from '../../../check/arbitrary/definition/Converters.ts';
import { webSegment } from '../../webSegment.ts';
import { array } from '../../array.ts';
import { segmentsToPathMapper, segmentsToPathUnmapper } from '../mappers/SegmentsToPath.ts';

/** @internal */
function sqrtSize(size: Size): [Size, Size] {
  switch (size) {
    case 'xsmall':
      return ['xsmall', 'xsmall']; // 1 = 1 x 1
    case 'small':
      return ['small', 'xsmall']; // 10 = 10 x 1
    case 'medium':
      return ['small', 'small']; // 100 = 10 x 10
    case 'large':
      return ['medium', 'small']; // 1000 = 100 x 10
    case 'xlarge':
      return ['medium', 'medium']; // 1000 = 100 x 10
  }
}

/** @internal */
export function buildUriPathArbitrary(resolvedSize: Size): Arbitrary<string> {
  const [segmentSize, numSegmentSize] = sqrtSize(resolvedSize);
  return convertFromNext(
    convertToNext(array(webSegment({ size: segmentSize }), { size: numSegmentSize })).map(
      segmentsToPathMapper,
      segmentsToPathUnmapper
    )
  );
}
