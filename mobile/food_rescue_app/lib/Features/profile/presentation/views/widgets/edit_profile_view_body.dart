import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../home/presentation/manager/get_profile_cubit/get_profile_cubit.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import '../../manager/edit_profile_cubit/edit_profile_cubit.dart';
import 'edit_profile_user_info_section.dart';
import 'edit_profile_save_button.dart';

class EditProfileViewBody extends StatefulWidget {
  const EditProfileViewBody({super.key});

  @override
  State<EditProfileViewBody> createState() => _EditProfileViewBodyState();
}

class _EditProfileViewBodyState extends State<EditProfileViewBody> {
  late final TextEditingController _nameController;
  File? _pickedImage;
  @override
  void initState() {
    super.initState();
    final profileState = context.read<GetProfileCubit>().state;
    _nameController = TextEditingController(
      text: profileState is GetProfileSuccessState
          ? profileState.userEntity.name
          : '',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocListener(
      listeners: [
        BlocListener<GetProfileCubit, GetProfileState>(
          listener: (context, state) {
            if (state is GetProfileSuccessState &&
                _nameController.text.isEmpty) {
              _nameController.text = state.userEntity.name;
            }
          },
        ),
        BlocListener<EditProfileCubit, EditProfileState>(
          listener: (context, state) {
            if (state is EditProfileSuccessState) {
              context.read<GetProfileCubit>().getProfile();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.responseModel.message),
                  backgroundColor: Colors.green,
                ),
              );
              Navigator.of(context).pop();
            } else if (state is EditProfileFailureState) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.errMessage),
                  backgroundColor: Colors.red,
                ),
              );
            }
          },
        ),
      ],
      child: CustomScrollView(
        slivers: [
          CustomSliverAppBar(
            widget: Text(
              context.loc.editProfile,
              style: AppTextStyles.title(context),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.only(left: 16.0, right: 16, top: 150),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  EditProfileUserInfoSection(
                    nameController: _nameController,
                    pickedImage: _pickedImage,
                    onImagePicked: (image) {
                      setState(() {
                        _pickedImage = image;
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  EditProfileSaveButton(
                    nameController: _nameController,
                    pickedImage: _pickedImage,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      );
  }
}
