
/**
 * This is a template string tag which returns the string as
 * it would otherwise appear if no tag was supplied.  This is
 * meant to support getting graphql syntax hilighting by using
 * it as though it is the `gql` tag, while still maintaining
 * the string required for `apollo-graphql` to process it.
 */
export default function taggedTemplateNoop (strings: TemplateStringsArray, ...keys: any[]) {
  return strings.slice(1).reduce((p, s, i) => p + keys[i] + s, strings[0])
}
