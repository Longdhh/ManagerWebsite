import { Routes } from '@angular/router';
import { TemplateComponent } from './template.component'

export const mainRoutes: Routes = [
    {path: '', component: TemplateComponent, children: [
        //localhost:4200/main
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        //localhost:4200/main/home
        { path: 'home', loadChildren: () => import('./home/home.module').then(x => x.HomeModule) },
        { path: 'home-slide', loadChildren: () => import('./banner/banner.module').then(x => x.BannerModule) },
        { path: 'job', loadChildren: () => import('./job/job.module').then(x => x.JobModule) },
        { path: 'level', loadChildren: () => import('./level/level.module').then(x => x.LevelModule) },
        { path: 'province', loadChildren: () => import('./province/province.module').then(x => x.ProvinceModule) },
        { path: 'salary', loadChildren: () => import('./salary/salary.module').then(x => x.SalaryModule) },
        { path: 'security', loadChildren: () => import('./security/security.module').then(x => x.SecurityModule) },
        { path: 'tos', loadChildren: () => import('./tos/tos.module').then(x => x.TosModule) },
        { path: 'welfare-type', loadChildren: () => import('./welfare-type/welfare-type.module').then(x => x.WelfareTypeModule) },
        { path: 'working-type', loadChildren: () => import('./working-type/working-type.module').then(x => x.WorkingTypeModule) },
        { path: 'roles', loadChildren: () => import('./roles/roles.module').then(x => x.RolesModule) },
        { path: 'users', loadChildren: () => import('./user/user.module').then(x => x.UserModule) },
        { path: 'category', loadChildren: () => import('./category/category.module').then(x => x.CategoryModule) },
        { path: 'blog', loadChildren:() => import('./blog/blog.module').then(x=>x.BlogModule)},
        { path: 'blog-category', loadChildren:() => import('./blog-category/blog-category.module').then(x=>x.BlogCategoryModule)}
    ]}
]