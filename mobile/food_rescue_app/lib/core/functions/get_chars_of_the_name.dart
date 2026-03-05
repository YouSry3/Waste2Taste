String getFirstCharsOfTwoStings(String name) {
  return name
      .split(' ')
      .map((e) {
        return e[0];
      })
      .toList()
      .take(2)
      .join()
      .toUpperCase();
}
