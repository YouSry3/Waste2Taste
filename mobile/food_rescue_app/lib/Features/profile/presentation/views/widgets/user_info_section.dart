import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:skeletonizer/skeletonizer.dart';
import '../../../../home/presentation/manager/get_profile_cubit/get_profile_cubit.dart';
import 'profile_image_with_name.dart';
import 'state_row.dart';

class UserInfoSection extends StatelessWidget {
  const UserInfoSection({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<GetProfileCubit, GetProfileState>(
      builder: (context, state) {
        final String name = state is GetProfileSuccessState
            ? state.userEntity.name
            : 'Loading User...';
        final String? imageUrl = state is GetProfileSuccessState
            ? state.userEntity.imageUrl
            : null;
        final int orderCount = state is GetProfileSuccessState
            ? state.userEntity.orderCount
            : 0;
        final double moneySpent = state is GetProfileSuccessState
            ? state.userEntity.moneySpent
            : 0.0;
        final double moneySaved = state is GetProfileSuccessState
            ? state.userEntity.moneySaved
            : 0.0;
        return Skeletonizer(
          enabled: state is GetProfileLoadingState,
          child: Column(
            children: [
              const SizedBox(height: 24),
              ProfileImagaWithName(name: name, imageUrl: imageUrl),
              const SizedBox(height: 24),
              StatesRow(
                orderCount: orderCount,
                moneySpent: moneySpent,
                moneySaved: moneySaved,
              ),
            ],
          ),
        );
      },
    );
  }
}
