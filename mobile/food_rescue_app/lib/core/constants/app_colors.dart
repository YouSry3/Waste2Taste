import 'package:flutter/material.dart';

abstract class AppColors {
  // const theme 
  static const Color primary = Color(0xFF10B981);
  static const Color primaryDark = Color(0xFF047857);
  static const Color secondary = Color(0xFFF59E0B);
  static const Color accent = Color(0xFFEF4444);
  static const Color black = Colors.black;

  //  Light Mode 
  static const Color backgroundLight = Color(0xFFFAFAFA);
  static const Color surfaceLight = Colors.white;
  static const Color textDarkLight = Color(0xFF1F2937);
  static const Color textGrayLight = Color(0xFF6B7280);
  static const Color fieldGrayLight = Color(0x7DE6E7E6);

  //  Dark Mode
  static const Color backgroundDark = Color(0xFF111827);
  static const Color surfaceDark = Color(0xFF1F2937);
  static const Color textDarkDark = Color(0xFFF9FAFB);
  static const Color textGrayDark = Color(0xFF9CA3AF);
  static const Color fieldGrayDark = Color(0x7D374151);

  static const Color background = backgroundLight;
  static const Color surface = surfaceLight;
  static const Color textDark = textDarkLight;
  static const Color textGray = textGrayLight;
  static const Color fieldGray = fieldGrayLight;
  static const Color textPrimary = textDarkLight;
}
