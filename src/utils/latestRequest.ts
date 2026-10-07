/**
 * Overlapping list requests (fast paging, a second search) can finish in any order: an older, slower response used
 * to overwrite newer rows, and whichever finished first switched the spinner off while the newer one was still
 * loading. Take a ticket per request; only the newest ticket may write results or end the loading state.
 */
export function latestRequest(): () => () => boolean {
  let newest = 0;
  return () => {
    const ticket = ++newest;
    return () => ticket === newest;
  };
}
