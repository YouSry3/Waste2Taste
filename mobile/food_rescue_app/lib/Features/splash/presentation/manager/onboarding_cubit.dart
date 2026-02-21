import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../models/onboarding_model.dart';

class OnboardingCubit extends Cubit<int> {
  OnboardingCubit() : super(0) {
    pageController = PageController();
  }

  late final PageController pageController;

  final List<OnboardingModel> _onBoardingList = [
    OnboardingModel(
      icon: LucideIcons.utensils,
      title: "Rescue Great Food",
      description:
          "Find quality meals at up to 70% off while helping protect the planet.",
      color: AppColors.primary,
    ),
    OnboardingModel(
      icon: LucideIcons.shoppingBag,
      title: "Premium Meals. Better Prices.",
      description:
          "Enjoy fresh, high-quality food at amazing discounts. Reserve in seconds.",
      color: AppColors.secondary,
    ),
    OnboardingModel(
      icon: LucideIcons.heart,
      title: "Join the Food Rescue Movement",
      description:
          "Save money, reduce waste, and turn everyday meals into real impact.",
      color: AppColors.accent,
    ),
  ];

  void next() {
    if (state < getLastPage) {
      emit(state + 1);
      pageController.nextPage(
        duration: const Duration(milliseconds: 200),
        curve: Curves.bounceInOut,
      );
    }
  }

  void jumpToPage() {
    if (state < getLastPage) {
      emit(getLastPage);
      pageController.animateToPage(
        getLastPage,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void back() {
    if (state > 0) {
      emit(state - 1);
      pageController.previousPage(
        duration: const Duration(milliseconds: 200),
        curve: Curves.bounceInOut,
      );
    }
  }

  void onPageChanged(int index) {
    emit(index);
  }

  int get listLength => _onBoardingList.length;
  int get getLastPage => _onBoardingList.length - 1;
  bool get isLastPage => _onBoardingList.length - 1 == state;
  bool get notFirstPage => state > 1;
  int get currentIndex => state;

  List<OnboardingModel> get getList => _onBoardingList;

  @override
  Future<void> close() {
    pageController.dispose();
    return super.close();
  }
}
