import 'package:intl/intl.dart';

String formatPickupTime(String isoTime) {
  try {
    final dateTime = DateTime.parse(isoTime).toLocal();
    return DateFormat('MMM d, h:mm a').format(dateTime);
  } catch (_) {
    return isoTime;
  }
}
