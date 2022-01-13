/**
 * The size parameter defines how large the generated values could be.
 *
 * The default in fast-check is 'small' but it could be increased (resp. decreased)
 * to ask arbitraries for larger (resp. smaller) values.
 *
 * @public
 */
export type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/**
 * Superset of {@link Size} to override the default defined for size
 * @public
 */
export type SizeForArbitrary = Size | undefined;

/**
 * The default size used by fast-check
 * @internal
 */
export const defaultSize: Size = 'small';

/**
 * Compute `maxLength` based on `minLength`
 * @internal
 */
export function maxLengthFromMinLength(minLength: number, size: Size): number {
  switch (size) {
    case 'xsmall':
      return Math.min(Math.floor(1.1 * minLength) + 1, 0x7fffffff); // min + (0.1 * min + 1)
    case 'small':
      return Math.min(2 * minLength + 10, 0x7fffffff); // min + (1 * min + 10)
    case 'medium':
      return Math.min(11 * minLength + 100, 0x7fffffff); // min + (10 * min + 100)
    case 'large':
      return Math.min(101 * minLength + 1000, 0x7fffffff); // min + (100 * min + 1000)
    case 'xlarge':
      return Math.min(1001 * minLength + 10000, 0x7fffffff); // min + (1000 * min + 10000)
    default:
      throw new Error(`Unbale to compute lengths based on received size: ${size}`);
  }
}
