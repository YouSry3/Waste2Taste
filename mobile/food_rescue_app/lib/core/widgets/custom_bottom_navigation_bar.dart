import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../functions/setup_service_locator.dart';
import '../../Features/home/domain/use_cases/get_profile_usecase.dart';
import '../../Features/home/domain/use_cases/get_user_location_usecase.dart';
import '../../Features/home/domain/use_cases/get_products_usecase.dart';
import '../../Features/home/presentation/manager/get_profile_cubit/get_profile_cubit.dart';
import '../../Features/home/presentation/manager/get_user_location_cubit/get_user_location_cubit.dart';
import '../../Features/home/presentation/manager/get_products_cubit/get_products_cubit.dart';
import '../../Features/home/presentation/views/home_view.dart';
import '../../Features/map/presentation/views/map_view.dart';
import '../../Features/orders/presentation/views/orders_view.dart';
import '../../Features/profile/presentation/views/profile_view.dart';
import 'custom_nav_bar.dart';

class CustomBottomNavigationBar extends StatefulWidget {
  const CustomBottomNavigationBar({super.key});

  @override
  State<CustomBottomNavigationBar> createState() =>
      _CustomBottomNavigationBarState();
}

class _CustomBottomNavigationBarState extends State<CustomBottomNavigationBar> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    HomeView(),
    MapView(),
    OrdersView(),
    ProfileView(),
  ];

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) =>
              GetProfileCubit(getIt.get<GetProfileUsecase>())..getProfile(),
        ),
        BlocProvider(
          create: (context) =>
              GetUserLocationCubit(getIt.get<GetUserLocationUsecase>())
                ..getUserLocation(),
        ),
        BlocProvider(
          create: (context) =>
              GetProductsCubit(getIt.get<GetProductsUsecase>())..getProducts(),
        ),
      ],
      child: Scaffold(
        body: IndexedStack(index: _currentIndex, children: _pages),
        bottomNavigationBar: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 500),
          child: CustomNavBar(
            currentIndex: _currentIndex,
            onTap: (index) => setState(() => _currentIndex = index),
          ),
        ),
      ),
    );
  }
}
