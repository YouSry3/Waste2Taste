import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/core/functions/simple_bloc_observer.dart';
import 'core/functions/setup_service_locator.dart';
import 'waste_2_taste_app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await setupServiceLocator();
  Bloc.observer = SimpleBlocObserver();
  runApp(const Waste2TasteApp());
}
