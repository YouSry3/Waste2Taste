import 'package:intl/intl.dart';

String formatDate(DateTime date) {
  final locale = Intl.getCurrentLocale();

  return DateFormat.yMMMd(locale).format(date);
}
