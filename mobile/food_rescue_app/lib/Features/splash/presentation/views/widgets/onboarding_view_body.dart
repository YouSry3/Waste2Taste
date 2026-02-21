import 'package:flutter/material.dart';
import 'custom_dot_indicator.dart';
import 'custom_elevated_botton.dart';
import 'page_view_onboarding_builder.dart';
import 'skip_text_button.dart';

class OnboardingViewBody extends StatelessWidget {
  const OnboardingViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SkipTextButton(),
        const Expanded(child: PageViewOnboardingBuilder()),
        const CustomDotIndicator(),
        const SizedBox(height: 20),
        const Padding(
          padding: EdgeInsetsGeometry.only(bottom: 20),
          child: CustomNextButton(),
        ),
      ],
    );
  }
}
