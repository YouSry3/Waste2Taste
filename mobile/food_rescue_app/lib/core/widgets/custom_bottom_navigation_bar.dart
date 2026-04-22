import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../functions/setup_service_locator.dart';
import '../../Features/home/domain/use_cases/get_products_usecase.dart';
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
    return BlocProvider(
      create: (context) =>
          GetProductsCubit(getIt.get<GetProductsUsecase>())..getProducts(),
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
