import 'package:flutter/material.dart';
import 'package:food_rescue_app/Features/splash/domain/entities/onboarding_entity.dart';
import 'package:food_rescue_app/core/mappers/ui_mappers.dart';
import 'onboarding_blob_section.dart';
import 'onboarding_text_section.dart';

class OnboardingPage extends StatelessWidget {
  const OnboardingPage({super.key, required this.model});
  final OnboardingEntity model;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        OnboardingBlobSection(
          color: UiMappers.toColor(model.colorName),
          icon: UiMappers.toIcon(model.iconName),
        ),
        const SizedBox(height: 48),
        OnboardingTextSection(
          title: model.title,
          description: model.description,
        ),
      ],
    );
  }
}
