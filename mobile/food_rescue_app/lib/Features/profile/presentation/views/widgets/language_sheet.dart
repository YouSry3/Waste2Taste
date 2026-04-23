import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/core/cubits/localization_cubit/localization_cubit.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import 'language_sheet_card.dart';

class LanguageSheet extends StatelessWidget {
  const LanguageSheet({super.key});

  @override
  Widget build(BuildContext context) {
    final locale = Localizations.localeOf(context).languageCode;

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 24),
      decoration: const BoxDecoration(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 45,
            height: 5,
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(20),
            ),
          ),
          const SizedBox(height: 20),

          Text(
            context.loc.chooseLanguage,
            style: Theme.of(
              context,
            ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),

          const SizedBox(height: 20),

          LanguageSheetCard(
            title: "English",
            subtitle: "Continue in English",
            isSelected: locale == 'en',
            onTap: () {
              context.read<LocalizationCubit>().changeLanguage('en');
              Navigator.pop(context);
            },
          ),

          const SizedBox(height: 12),

          LanguageSheetCard(
            title: "العربية",
            subtitle: "تابع باللغة العربية",
            isSelected: locale == 'ar',
            onTap: () async {
              context.read<LocalizationCubit>().changeLanguage('ar');
              Navigator.pop(context);
            },
          ),
          const SizedBox(height: 10),
        ],
      ),
    );
  }
}
