import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/profile_text_field.dart';
import '../../../../home/presentation/manager/get_profile_cubit/get_profile_cubit.dart';
import 'profile_avatar_picker.dart';

class EditProfileUserInfoSection extends StatelessWidget {
  const EditProfileUserInfoSection({
    super.key,
    required this.nameController,
    this.pickedImage,
    required this.onImagePicked,
  });

  final TextEditingController nameController;
  final File? pickedImage;
  final ValueChanged<File> onImagePicked;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<GetProfileCubit, GetProfileState>(
      builder: (context, state) {
        return Column(
          children: [
            ProfileAvatarPicker(
              image: state is GetProfileSuccessState
                  ? state.userEntity.imageUrl
                  : null,
              name: state is GetProfileSuccessState
                  ? state.userEntity.name
                  : "",
              pickedImage: pickedImage,
              onImagePicked: onImagePicked,
            ),
            const SizedBox(height: 32),
            ProfileTextField(
              label: context.loc.fullName,
              controller: nameController,
            ),
          ],
        );
      },
    );
  }
}
