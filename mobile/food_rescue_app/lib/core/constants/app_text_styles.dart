import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

abstract class AppTextStyles {
  static TextStyle base(BuildContext context) =>
      GoogleFonts.outfit(color: Theme.of(context).colorScheme.onSurface);

  static TextStyle title(BuildContext context) =>
      base(context).copyWith(fontSize: 20);

  static TextStyle body(BuildContext context) =>
      base(context).copyWith(fontWeight: FontWeight.normal, fontSize: 15);

  static TextStyle subtitle(BuildContext context) => base(context).copyWith(
    color: AppColors.textMuted(context),
    fontWeight: FontWeight.normal,
    fontSize: 20,
    letterSpacing: 0.5,
    height: 1.5,
  );

  static TextStyle label(BuildContext context) =>
      base(context).copyWith(fontWeight: FontWeight.w600, fontSize: 15);

  static final TextStyle button = GoogleFonts.outfit(
    color: Colors.white,
    fontWeight: FontWeight.w600,
    fontSize: 17,
  );

  static final TextStyle logo = GoogleFonts.fredoka(
    fontSize: 56,
    fontWeight: FontWeight.bold,
    height: .9,
  );
}
