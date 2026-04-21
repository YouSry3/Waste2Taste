import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:waste2taste/Features/home/domain/entities/user_entity.dart';

part 'get_profile_state.dart';

class GetProfileCubit extends Cubit<GetProfileState> {
  GetProfileCubit() : super(GetProfileInitialState());
}
