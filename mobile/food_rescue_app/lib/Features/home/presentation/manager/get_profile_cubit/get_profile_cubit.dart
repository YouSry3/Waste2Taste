import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';

part 'get_profile_state.dart';

class GetProfileCubit extends Cubit<GetProfileState> {
  GetProfileCubit() : super(GetProfileInitialState());
}
