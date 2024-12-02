import type { Schema, Struct } from '@strapi/strapi';

export interface ButtonsOutLineButton extends Struct.ComponentSchema {
  collectionName: 'components_buttons_out_line_buttons';
  info: {
    displayName: 'Out-Line-Button';
  };
  attributes: {
    bgColor: Schema.Attribute.String;
    borderColor: Schema.Attribute.String;
    buttonContent: Schema.Attribute.String;
  };
}

export interface PaymentsPaymentMethod extends Struct.ComponentSchema {
  collectionName: 'components_payments_payment_method';
  info: {
    displayName: 'Payment-Method';
  };
  attributes: {
    amountCents: Schema.Attribute.String;
    cardType: Schema.Attribute.String;
    currency: Schema.Attribute.String;
    dataMessage: Schema.Attribute.String;
    errorOccured: Schema.Attribute.Boolean;
    orderCreatedAt: Schema.Attribute.String;
    orderId: Schema.Attribute.BigInteger;
    PaymentMerchent: Schema.Attribute.Enumeration<
      ['Paymob', 'Paypal', 'Stripe', 'Wallet']
    >;
    paymentStatus: Schema.Attribute.Boolean;
    txnResponseCode: Schema.Attribute.String;
  };
}

export interface PlanFeaturesSubBenefit extends Struct.ComponentSchema {
  collectionName: 'components_plan_features_sub_benefits';
  info: {
    displayName: 'Sub-Benefit';
  };
  attributes: {
    benefit: Schema.Attribute.String;
    isBenefitFeatureEnabled: Schema.Attribute.Boolean;
  };
}

export interface PlanPlanStyle extends Struct.ComponentSchema {
  collectionName: 'components_plan_plan_styles';
  info: {
    description: '';
    displayName: 'Plan-Style';
  };
  attributes: {
    bgColor: Schema.Attribute.String;
    borderColor: Schema.Attribute.String;
    dividerColor: Schema.Attribute.String;
    isBenefitIncludedColor: Schema.Attribute.String;
    priceTypeColor: Schema.Attribute.String;
    subscribeButtonStyle: Schema.Attribute.Component<
      'buttons.out-line-button',
      false
    >;
    textColor: Schema.Attribute.String;
  };
}

export interface PlanPlansSubscriptions extends Struct.ComponentSchema {
  collectionName: 'components_plan_plans_subscriptions';
  info: {
    description: '';
    displayName: 'Plan-Benefits';
  };
  attributes: {
    benefit: Schema.Attribute.String;
    benefitDesc: Schema.Attribute.String;
    isBenefitIncluded: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    subBenefits: Schema.Attribute.Component<'plan-features.sub-benefit', true>;
  };
}

export interface UserBillingAddress extends Struct.ComponentSchema {
  collectionName: 'components_user_billing_addresses';
  info: {
    displayName: 'Billing-Address';
  };
  attributes: {
    apartment: Schema.Attribute.String;
    buildingNumber: Schema.Attribute.String;
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    email: Schema.Attribute.String;
    firstName: Schema.Attribute.String;
    floor: Schema.Attribute.String;
    lastName: Schema.Attribute.String;
    phoneNumber: Schema.Attribute.String;
    postalCode: Schema.Attribute.String;
    state: Schema.Attribute.String;
    street: Schema.Attribute.String;
  };
}

export interface UserDeviceUsed extends Struct.ComponentSchema {
  collectionName: 'components_user_device_useds';
  info: {
    displayName: 'Device-Used';
  };
  attributes: {
    lastLoginAt: Schema.Attribute.DateTime;
    manufactorer: Schema.Attribute.String;
    model: Schema.Attribute.String;
    product: Schema.Attribute.String;
    serialNumber: Schema.Attribute.String;
  };
}

export interface UserSubscriptionDetails extends Struct.ComponentSchema {
  collectionName: 'components_user_subscription_details';
  info: {
    displayName: 'Subscription-Details';
  };
  attributes: {
    autoRenew: Schema.Attribute.Boolean;
    cancellationReason: Schema.Attribute.String;
    endDate: Schema.Attribute.DateTime;
    gracePeriodEndDate: Schema.Attribute.DateTime;
    payment: Schema.Attribute.Relation<'oneToOne', 'api::payment.payment'>;
    renewalDate: Schema.Attribute.DateTime;
    startDate: Schema.Attribute.DateTime;
    subscribedAt: Schema.Attribute.DateTime;
    subscribedUpdateAt: Schema.Attribute.DateTime;
    subscriptionStatus: Schema.Attribute.Enumeration<
      ['active', 'trialing', 'past_due', 'canceled', 'expired']
    >;
    trialEndDate: Schema.Attribute.DateTime;
  };
}

export interface VersionReleaseMedia extends Struct.ComponentSchema {
  collectionName: 'components_version_release_media';
  info: {
    displayName: 'Media';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    imageTitle: Schema.Attribute.String;
  };
}

export interface VersionReleasePlatformRequirements
  extends Struct.ComponentSchema {
  collectionName: 'components_version_release_platform_requirements';
  info: {
    displayName: 'Platform-Requirements';
  };
  attributes: {
    downloadURL: Schema.Attribute.String;
    isMandatory: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    minSupportedVersionCode: Schema.Attribute.Integer;
    platform: Schema.Attribute.Enumeration<
      ['Windows', 'MacOs', 'Linux', 'Android', 'IOS', 'WEB']
    >;
    priority: Schema.Attribute.Enumeration<
      ['none', 'recommended', 'high', 'mandatory']
    >;
    version: Schema.Attribute.String;
    versionCode: Schema.Attribute.Integer;
  };
}

export interface VersionReleasePlatformVersionRelease
  extends Struct.ComponentSchema {
  collectionName: 'components_version_release_platform_version_releases';
  info: {
    description: '';
    displayName: 'Platform-Version-Release';
  };
  attributes: {
    appSize: Schema.Attribute.Decimal;
    bugFixes: Schema.Attribute.Component<'version-release.release-note', true>;
    downloadURL: Schema.Attribute.String;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    improvements: Schema.Attribute.Component<
      'version-release.release-note',
      true
    >;
    isMandatory: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isUpdateBugFixing: Schema.Attribute.Boolean;
    minSupportedVersion: Schema.Attribute.Integer;
    newFeatures: Schema.Attribute.Component<
      'version-release.update-high-light',
      true
    >;
    platform: Schema.Attribute.Enumeration<
      ['Windows', 'MacOs', 'Linux', 'Android', 'IOS', 'WEB']
    >;
    priority: Schema.Attribute.Enumeration<
      ['none', 'recommended', 'high', 'mandatory']
    >;
    releaseChannel: Schema.Attribute.Enumeration<['Production', 'Beta']>;
    releaseDate: Schema.Attribute.DateTime;
    releaseNotes: Schema.Attribute.Component<
      'version-release.release-note',
      true
    >;
    updatesHighLights: Schema.Attribute.Component<
      'version-release.update-high-light',
      true
    >;
    version: Schema.Attribute.String;
    versionCode: Schema.Attribute.Integer;
    versionName: Schema.Attribute.String;
  };
}

export interface VersionReleaseReleaseNote extends Struct.ComponentSchema {
  collectionName: 'components_version_release_release_notes';
  info: {
    displayName: 'Release-Note';
  };
  attributes: {
    note: Schema.Attribute.String;
  };
}

export interface VersionReleaseUpdateHighLight extends Struct.ComponentSchema {
  collectionName: 'components_version_release_update_high_lights';
  info: {
    description: '';
    displayName: 'Update-High-Light';
  };
  attributes: {
    description: Schema.Attribute.Text;
    media: Schema.Attribute.Component<'version-release.media', true>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'buttons.out-line-button': ButtonsOutLineButton;
      'payments.payment-method': PaymentsPaymentMethod;
      'plan-features.sub-benefit': PlanFeaturesSubBenefit;
      'plan.plan-style': PlanPlanStyle;
      'plan.plans-subscriptions': PlanPlansSubscriptions;
      'user.billing-address': UserBillingAddress;
      'user.device-used': UserDeviceUsed;
      'user.subscription-details': UserSubscriptionDetails;
      'version-release.media': VersionReleaseMedia;
      'version-release.platform-requirements': VersionReleasePlatformRequirements;
      'version-release.platform-version-release': VersionReleasePlatformVersionRelease;
      'version-release.release-note': VersionReleaseReleaseNote;
      'version-release.update-high-light': VersionReleaseUpdateHighLight;
    }
  }
}
