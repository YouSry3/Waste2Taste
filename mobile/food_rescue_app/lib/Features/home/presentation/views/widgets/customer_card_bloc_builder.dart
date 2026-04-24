import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:skeletonizer/skeletonizer.dart';
import '../../manager/get_profile_cubit/get_profile_cubit.dart';
import 'customer_card.dart';

class CustomerCardBlocBuilder extends StatelessWidget {
  const CustomerCardBlocBuilder({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<GetProfileCubit, GetProfileState>(
      builder: (context, profileState) {
        final bool isLoading =
            profileState is GetProfileLoadingState ||
            profileState is GetProfileInitialState;

        final String userName = profileState is GetProfileSuccessState
            ? profileState.userEntity.name
            : 'Loading User...';

        final String profileImageUrl = profileState is GetProfileSuccessState
            ? (profileState.userEntity.imageUrl ?? '')
            : '';

        return Skeletonizer(
          enabled: isLoading,
          child: CustomerCard(
            userName: userName,
            profileImageUrl: profileImageUrl,
          ),
        );
      },
    );
  }
}
