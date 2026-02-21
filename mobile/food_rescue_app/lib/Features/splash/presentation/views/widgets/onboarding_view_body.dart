import 'package:flutter/material.dart';

import 'skip_text_button.dart';

class OnboardingViewBody extends StatelessWidget {
  const OnboardingViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(children: [const SkipTextButton()]);
  }
}
