String getFirstCharsOfTwoStings(String name) {
  if (name.trim().isEmpty) return '?';
  return name
      .trim()
      .split(' ')
      .where((e) => e.isNotEmpty)
      .map((e) => e[0])
      .take(2)
      .join()
      .toUpperCase();
}
