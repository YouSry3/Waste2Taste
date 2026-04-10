import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/onboarding_entity.dart';
import '../../domain/repos/onboarding_repo.dart';

class OnboardingCubit extends Cubit<int> {
  OnboardingCubit({required this.onboardingRepo, })
    : _onBoardingList = onboardingRepo.getPages(),
      super(0) {
    pageController = PageController();
  }

  late PageController pageController;
  final OnboardingRepo onboardingRepo;
  
  final List<OnboardingEntity> _onBoardingList;
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

  List<OnboardingEntity> get getList => _onBoardingList;

  @override
  Future<void> close() {
    pageController.dispose();
    return super.close();
  }
}
