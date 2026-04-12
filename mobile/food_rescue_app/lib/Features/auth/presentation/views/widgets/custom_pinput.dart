import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pinput/pinput.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';

class CustomPinput extends StatefulWidget {
  const CustomPinput({super.key, required this.pinController});
  final TextEditingController pinController;
  @override
  State<CustomPinput> createState() => _CustomPinputState();
}

class _CustomPinputState extends State<CustomPinput> {
  late TextEditingController _displayController;
  bool _isArabic = false;

  static const Map<String, String> _toArabicDigits = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
  };

  static const Map<String, String> _toWesternDigits = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
  };

  String _convertToArabic(String input) =>
      input.split('').map((c) => _toArabicDigits[c] ?? c).join();

  String _convertToWestern(String input) =>
      input.split('').map((c) => _toWesternDigits[c] ?? c).join();

  @override
  void initState() {
    super.initState();
    _displayController = TextEditingController();

    _displayController.addListener(() {
      final displayText = _displayController.text;
      final westernText = _isArabic
          ? _convertToWestern(displayText)
          : displayText;

      if (widget.pinController.text != westernText) {
        widget.pinController.text = westernText;
      }
    });
  }

  @override
  void dispose() {
    _displayController.dispose();
    super.dispose();
  }

  PinTheme _buildDefaultPinTheme(BuildContext context) => PinTheme(
    width: 56,
    height: 56,
    textStyle: AppTextStyles.title.copyWith(fontSize: 21),
    decoration: BoxDecoration(
      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.08),
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: Colors.transparent),
    ),
  );

  PinTheme _buildFocusedPinTheme(BuildContext context) =>
      _buildDefaultPinTheme(context).copyDecorationWith(
        border: Border.all(color: AppColors.primary),
        color: Theme.of(context).scaffoldBackgroundColor,
      );

  @override
  Widget build(BuildContext context) {
    _isArabic = Localizations.localeOf(context).languageCode == 'ar';

    return Pinput(
      controller: _displayController,
      length: 6,
      defaultPinTheme: _buildDefaultPinTheme(context),
      focusedPinTheme: _buildFocusedPinTheme(context),
      inputFormatters: _isArabic
          ? [
              TextInputFormatter.withFunction((oldValue, newValue) {
                final converted = _convertToArabic(
                  _convertToWestern(newValue.text),
                );
                return newValue.copyWith(
                  text: converted,
                  selection: TextSelection.collapsed(offset: converted.length),
                );
              }),
            ]
          : [],
      keyboardType: TextInputType.number,
    );
  }
}
