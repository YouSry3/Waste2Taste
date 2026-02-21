import 'package:flutter/material.dart';
import '../../models/onboarding_model.dart';
import 'onboarding_blob_section.dart';
import 'onboarding_text_section.dart';

class OnboardingPage extends StatelessWidget {
  const OnboardingPage({super.key, required this.model});
  final OnboardingModel model;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        OnboardingBlobSection(color: model.color, icon: model.icon),
        const SizedBox(height: 48),
        OnboardingTextSection(
          title: model.title,
          description: model.description,
        ),
      ],
    );
  }
}
