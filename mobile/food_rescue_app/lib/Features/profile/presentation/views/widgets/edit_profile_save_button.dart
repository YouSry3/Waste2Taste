import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../data/models/edit_profile_request_model.dart';
import '../../manager/edit_profile_cubit/edit_profile_cubit.dart';

class EditProfileSaveButton extends StatelessWidget {
  const EditProfileSaveButton({
    super.key,
    required this.nameController,
    this.pickedImage,
  });

  final TextEditingController nameController;
  final File? pickedImage;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<EditProfileCubit, EditProfileState>(
      builder: (context, state) {
        final isLoading = state is EditProfileLoadingState;
        return CustomElevatedButton(
          onPressed: isLoading
              ? null
              : () {
                  final name = nameController.text.trim();
                  if (name.isEmpty) return;
                  context.read<EditProfileCubit>().editProfile(
                    requestModel: EditProfileRequestModel(
                      name: name,
                      imageUrl: pickedImage?.path,
                    ),
                  );
                },
          child: isLoading
              ? const SizedBox(
                  height: 24,
                  width: 24,
                  child: CircularProgressIndicator(
                    color: Colors.white,
                    strokeWidth: 2.5,
                  ),
                )
              : Text(context.loc.saveChanges, style: AppTextStyles.button),
        );
      },
    );
  }
}
