import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:waste2taste/core/enums/color_name.dart';
import 'package:waste2taste/core/enums/icon_name.dart';
import 'package:waste2taste/Features/splash/domain/entities/onboarding_entity.dart';
import 'package:waste2taste/Features/splash/domain/repos/onboarding_repo.dart';
import 'package:waste2taste/Features/splash/presentation/manager/onboarding_cubit.dart';

class MockOnboardingRepo extends Mock implements OnboardingRepo {}

void main() {
  late MockOnboardingRepo mockOnboardingRepo;
  late List<OnboardingEntity> fakePages;

  setUp(() {
    mockOnboardingRepo = MockOnboardingRepo();
    fakePages = [
      OnboardingEntity(
        iconName: IconName.utensils,
        colorName: ColorName.primary,
        titleKey: 'Rescue Food',
        descriptionKey: 'Rescue description',
      ),
      OnboardingEntity(
        iconName: IconName.shoppingBag,
        colorName: ColorName.secondary,
        titleKey: 'Premium Meals',
        descriptionKey: 'Premium description',
      ),
      OnboardingEntity(
        iconName: IconName.heart,
        colorName: ColorName.accent,
        titleKey: 'Join Movement',
        descriptionKey: 'Movement description',
      ),
    ];
    when(() => mockOnboardingRepo.getPages()).thenReturn(fakePages);
  });

  testWidgets('OnboardingCubit basic states and page navigation tests', (WidgetTester tester) async {
    final cubit = OnboardingCubit(onboardingRepo: mockOnboardingRepo);

    // Build MaterialApp with PageView to attach the PageController
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: PageView(
            controller: cubit.pageController,
            onPageChanged: cubit.onPageChanged,
            children: const [
              Text('Page 1 Content'),
              Text('Page 2 Content'),
              Text('Page 3 Content'),
            ],
          ),
        ),
      ),
    );

    // Initial checks
    expect(cubit.state, 0);
    expect(cubit.listLength, 3);
    expect(cubit.getLastPage, 2);
    expect(cubit.isLastPage, isFalse);
    expect(cubit.notFirstPage, isFalse);
    expect(cubit.getList, fakePages);

    // Navigate to next page
    cubit.next();
    await tester.pumpAndSettle();
    expect(cubit.state, 1);
    expect(cubit.isLastPage, isFalse);

    // Navigate to next page (last page)
    cubit.next();
    await tester.pumpAndSettle();
    expect(cubit.state, 2);
    expect(cubit.isLastPage, isTrue);

    // Navigate back
    cubit.back();
    await tester.pumpAndSettle();
    expect(cubit.state, 1);

    // Jump directly to last page
    cubit.jumpToPage();
    await tester.pumpAndSettle();
    expect(cubit.state, 2);
    expect(cubit.isLastPage, isTrue);
  });
}
