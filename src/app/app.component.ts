import {Component, OnInit, HostBinding, OnDestroy, Inject, LOCALE_ID} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {OverlayContainer} from "@angular/cdk/overlay";
import {ThemeService} from "./theme.service";
import {Subscription} from "rxjs";
import {Title} from "@angular/platform-browser";

const THEME_DARKNESS_SUFFIX = `-dark`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy{

  @HostBinding('class') currentThemeCssClass: string;
  isThemeDark = false;
  currentTheme: string;
  private darkModeToggleSub: Subscription;

  constructor(private authService: AuthService,
              private overlayContainer: OverlayContainer,
              private themeService: ThemeService,
              @Inject(LOCALE_ID) private locale: string,
              private titleService: Title) {

    this.titleService.setTitle($localize`Dictionary`);

    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //   this.isThemeDark = true;
    // }

    let isDark = JSON.parse(localStorage.getItem('isThemeDark'));
    this.setTheme('indigo-pink', isDark); // Default Theme

    this.darkModeToggleSub = this.themeService.toggleDarkMode.subscribe(
      (mode: boolean) => {
        this.setTheme(this.currentTheme, mode);
      }
    )

    localStorage.setItem("lang" , locale); // Default Language
  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }

  setTheme(theme: string, darkness: boolean = null) {
    if (darkness === null) {
      darkness = this.isThemeDark;
    }else if (this.isThemeDark === darkness) {
      if (this.currentTheme === theme) return;
    } else {
      this.isThemeDark = darkness;
      localStorage.setItem("isThemeDark" , JSON.stringify(this.isThemeDark));
    }

    this.currentTheme = theme;

    const cssClass = darkness === true ? theme + THEME_DARKNESS_SUFFIX : theme;

    const classList = this.overlayContainer.getContainerElement().classList;
    if (classList.contains(this.currentThemeCssClass))
      classList.replace(this.currentThemeCssClass, cssClass);
    else
      classList.add(cssClass);

    this.currentThemeCssClass = cssClass;
  }

  ngOnDestroy() {
    this.darkModeToggleSub.unsubscribe();
  }
}
