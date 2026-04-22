import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:skeletonizer/skeletonizer.dart';
import '../../manager/get_profile_cubit/get_profile_cubit.dart';
import '../../manager/get_user_location_cubit/get_user_location_cubit.dart';
import 'customer_card.dart';

class CustomerCardBlocSelector extends StatelessWidget {
  const CustomerCardBlocSelector({super.key});

  @override
  Widget build(BuildContext context) {
    final userName = context.select<GetProfileCubit, String>(
      (cubit) => cubit.state is GetProfileSuccessState
          ? (cubit.state as GetProfileSuccessState).userEntity.name
          : 'Loading User...',
    );

    final profileImageUrl = context.select<GetProfileCubit, String>(
      (cubit) => cubit.state is GetProfileSuccessState
          ? ((cubit.state as GetProfileSuccessState).userEntity.imageUrl ?? '')
          : '',
    );

    final isProfileLoading = context.select<GetProfileCubit, bool>(
      (cubit) =>
          cubit.state is GetProfileLoadingState ||
          cubit.state is GetProfileInitialState,
    );

    final location = context.select<GetUserLocationCubit, String>((cubit) {
      final state = cubit.state;
      if (state is GetUserLocationSuccessState) {
        final lang = Localizations.localeOf(context).languageCode;
        return lang == 'en'
            ? state.locationEntity.addressEn
            : state.locationEntity.addressAr;
      } else if (state is GetUserLocationFailureState) {
        return 'Location unavailable';
      }
      return 'Locating...';
    });

 
    return Skeletonizer(
      enabled: isProfileLoading,
      child: CustomerCard(
        userName: userName,
        location: location,
        profileImageUrl: profileImageUrl,
      ),
    );
  }
}
