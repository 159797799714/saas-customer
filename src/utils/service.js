
export function link (data) {
  // eslint-disable-next-line valid-typeof
  if (typeof (data) === Object) {
    this.$router.push(data.path)
  // eslint-disable-next-line valid-typeof
  } else if (typeof (data) === String) {
    this.$router.push(data)
  }
}
