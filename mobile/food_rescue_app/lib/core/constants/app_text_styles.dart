import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

abstract class AppTextStyles {
  static final TextStyle _base = GoogleFonts.outfit(color: AppColors.textDark);

  static TextStyle get title => _base.copyWith(
    fontSize: 28,
    wordSpacing: 0,
    color: AppColors.textDark,
    fontWeight: FontWeight.bold,
  );

  static TextStyle get body =>
      _base.copyWith(fontWeight: FontWeight.normal, fontSize: 15);

  static TextStyle get subtitle => _base.copyWith(
    color: AppColors.textGray,
    fontWeight: FontWeight.normal,
    fontSize: 20,
    letterSpacing: 0.5,
    height: 1.5,
  );

  static TextStyle get button => _base.copyWith(
    color: Colors.white,
    fontWeight: FontWeight.w600,
    fontSize: 17,
  );

  static TextStyle get label =>
      _base.copyWith(fontWeight: FontWeight.w600, fontSize: 15);

  static TextStyle get appBarTitle =>
      title.copyWith(fontSize: 18, fontFamily: 'Poppins');

  static TextStyle get linkPrimary =>
      _base.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold);
}
