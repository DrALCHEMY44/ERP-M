import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




<<<<<<< HEAD
export interface AddReviewData {
  review_upsert: Review_Key;
}

export interface AddReviewVariables {
  movieId: UUIDString;
  rating: number;
  reviewText: string;
}

export interface CreateMovieData {
  movie_insert: Movie_Key;
}

export interface CreateMovieVariables {
  title: string;
  genre: string;
  imageUrl: string;
}

export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}

export interface DeleteReviewVariables {
  movieId: UUIDString;
}

export interface GetMovieByIdData {
  movie?: {
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
    metadata?: {
      rating?: number | null;
      releaseYear?: number | null;
      description?: string | null;
    };
      reviews: ({
        reviewText?: string | null;
        reviewDate: DateString;
        rating?: number | null;
        user: {
          id: string;
          username: string;
        } & User_Key;
      })[];
  } & Movie_Key;
}

export interface GetMovieByIdVariables {
  id: UUIDString;
}

export interface ListMoviesData {
  movies: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
  } & Movie_Key)[];
}

export interface ListUserReviewsData {
  user?: {
    id: string;
    username: string;
    reviews: ({
      rating?: number | null;
      reviewDate: DateString;
      reviewText?: string | null;
      movie: {
        id: UUIDString;
        title: string;
      } & Movie_Key;
    })[];
  } & User_Key;
=======
export interface AIQuery_Key {
  id: UUIDString;
  __typename?: 'AIQuery_Key';
}

export interface ActivityLog_Key {
  id: UUIDString;
  __typename?: 'ActivityLog_Key';
}

export interface Business_Key {
  id: UUIDString;
  __typename?: 'Business_Key';
}

export interface CreateBusinessData {
  business_insert: Business_Key;
}

export interface CreateBusinessVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessType?: string | null;
      businessType_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              location?: string | null;
              location_expr?: {
              };
                name?: string | null;
                name_expr?: {
                };
                  region?: string | null;
                  region_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}

export interface CreateCustomerData {
  customer_insert: Customer_Key;
}

export interface CreateCustomerVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              customerName?: string | null;
              customerName_expr?: {
              };
                email?: string | null;
                email_expr?: {
                };
                  phoneNumber?: string | null;
                  phoneNumber_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}

export interface CreateDocumentData {
  document_insert: Document_Key;
}

export interface CreateDocumentVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        documentType?: string | null;
        documentType_expr?: {
        };
          fileUrl?: string | null;
          fileUrl_expr?: {
          };
            tenantId?: UUIDString | null;
            tenantId_expr?: {
            };
              title?: string | null;
              title_expr?: {
              };
                uploadedAt?: TimestampString | null;
                uploadedAt_expr?: {
                };
                  uploadedAt_time?: {
                    now?: {
                    };
                      at?: TimestampString | null;
                      add?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        sub?: {
                          milliseconds?: number;
                          seconds?: number;
                          minutes?: number;
                          hours?: number;
                          days?: number;
                          weeks?: number;
                          months?: number;
                          years?: number;
                        };
                          truncateTo?: Timestamp_Interval | null;
                  };
                    uploadedAt_update?: ({
                      inc?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        dec?: {
                          milliseconds?: number;
                          seconds?: number;
                          minutes?: number;
                          hours?: number;
                          days?: number;
                          weeks?: number;
                          months?: number;
                          years?: number;
                        };
                    })[];
                      uploadedBy?: UUIDString | null;
                      uploadedBy_expr?: {
                      };
  };
}

export interface CreateEmployeeData {
  employee_insert: Employee_Key;
}

export interface CreateEmployeeVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              department?: string | null;
              department_expr?: {
              };
                fullName?: string | null;
                fullName_expr?: {
                };
                  position?: string | null;
                  position_expr?: {
                  };
                    salary?: number | null;
                    salary_expr?: {
                    };
                      salary_update?: ({
                        inc?: number | null;
                        dec?: number | null;
                      })[];
                        startDate?: DateString | null;
                        startDate_expr?: {
                        };
                          startDate_date?: {
                            today?: {
                            };
                              on?: DateString | null;
                              add?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                sub?: {
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                                  truncateTo?: Date_Interval | null;
                          };
                            startDate_update?: ({
                              inc?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                dec?: {
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                            })[];
                              status?: string | null;
                              status_expr?: {
                              };
                                tenantId?: UUIDString | null;
                                tenantId_expr?: {
                                };
  };
}

export interface CreateProductData {
  product_insert: Product_Key;
}

export interface CreateProductVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        category?: string | null;
        category_expr?: {
        };
          costPrice?: number | null;
          costPrice_expr?: {
          };
            costPrice_update?: ({
              inc?: number | null;
              dec?: number | null;
            })[];
              createdAt?: TimestampString | null;
              createdAt_expr?: {
              };
                createdAt_time?: {
                  now?: {
                  };
                    at?: TimestampString | null;
                    add?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      sub?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        truncateTo?: Timestamp_Interval | null;
                };
                  createdAt_update?: ({
                    inc?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      dec?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                  })[];
                    createdBy?: UUIDString | null;
                    createdBy_expr?: {
                    };
                      expiryDate?: DateString | null;
                      expiryDate_expr?: {
                      };
                        expiryDate_date?: {
                          today?: {
                          };
                            on?: DateString | null;
                            add?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              sub?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                truncateTo?: Date_Interval | null;
                        };
                          expiryDate_update?: ({
                            inc?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              dec?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                          })[];
                            lowStockLevel?: number | null;
                            lowStockLevel_expr?: {
                            };
                              lowStockLevel_update?: ({
                                inc?: number | null;
                                dec?: number | null;
                              })[];
                                name?: string | null;
                                name_expr?: {
                                };
                                  quantity?: number | null;
                                  quantity_expr?: {
                                  };
                                    quantity_update?: ({
                                      inc?: number | null;
                                      dec?: number | null;
                                    })[];
                                      sellingPrice?: number | null;
                                      sellingPrice_expr?: {
                                      };
                                        sellingPrice_update?: ({
                                          inc?: number | null;
                                          dec?: number | null;
                                        })[];
                                          tenantId?: UUIDString | null;
                                          tenantId_expr?: {
                                          };
                                            updatedAt?: TimestampString | null;
                                            updatedAt_expr?: {
                                            };
                                              updatedAt_time?: {
                                                now?: {
                                                };
                                                  at?: TimestampString | null;
                                                  add?: {
                                                    milliseconds?: number;
                                                    seconds?: number;
                                                    minutes?: number;
                                                    hours?: number;
                                                    days?: number;
                                                    weeks?: number;
                                                    months?: number;
                                                    years?: number;
                                                  };
                                                    sub?: {
                                                      milliseconds?: number;
                                                      seconds?: number;
                                                      minutes?: number;
                                                      hours?: number;
                                                      days?: number;
                                                      weeks?: number;
                                                      months?: number;
                                                      years?: number;
                                                    };
                                                      truncateTo?: Timestamp_Interval | null;
                                              };
                                                updatedAt_update?: ({
                                                  inc?: {
                                                    milliseconds?: number;
                                                    seconds?: number;
                                                    minutes?: number;
                                                    hours?: number;
                                                    days?: number;
                                                    weeks?: number;
                                                    months?: number;
                                                    years?: number;
                                                  };
                                                    dec?: {
                                                      milliseconds?: number;
                                                      seconds?: number;
                                                      minutes?: number;
                                                      hours?: number;
                                                      days?: number;
                                                      weeks?: number;
                                                      months?: number;
                                                      years?: number;
                                                    };
                                                })[];
  };
}

export interface CreateSupplierData {
  supplier_insert: Supplier_Key;
}

export interface CreateSupplierVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              email?: string | null;
              email_expr?: {
              };
                phoneNumber?: string | null;
                phoneNumber_expr?: {
                };
                  supplierName?: string | null;
                  supplierName_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}

export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      assignedToId?: UUIDString | null;
      assignedToId_expr?: {
      };
        assignedTo?: User_Key | null;
        businessId?: UUIDString | null;
        businessId_expr?: {
        };
          createdAt?: TimestampString | null;
          createdAt_expr?: {
          };
            createdAt_time?: {
              now?: {
              };
                at?: TimestampString | null;
                add?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  sub?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
                    truncateTo?: Timestamp_Interval | null;
            };
              createdAt_update?: ({
                inc?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  dec?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
              })[];
                createdBy?: UUIDString | null;
                createdBy_expr?: {
                };
                  description?: string | null;
                  description_expr?: {
                  };
                    dueDate?: TimestampString | null;
                    dueDate_expr?: {
                    };
                      dueDate_time?: {
                        now?: {
                        };
                          at?: TimestampString | null;
                          add?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            sub?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              truncateTo?: Timestamp_Interval | null;
                      };
                        dueDate_update?: ({
                          inc?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            dec?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                        })[];
                          priority?: string | null;
                          priority_expr?: {
                          };
                            status?: string | null;
                            status_expr?: {
                            };
                              tenantId?: UUIDString | null;
                              tenantId_expr?: {
                              };
                                title?: string | null;
                                title_expr?: {
                                };
                                  updatedAt?: TimestampString | null;
                                  updatedAt_expr?: {
                                  };
                                    updatedAt_time?: {
                                      now?: {
                                      };
                                        at?: TimestampString | null;
                                        add?: {
                                          milliseconds?: number;
                                          seconds?: number;
                                          minutes?: number;
                                          hours?: number;
                                          days?: number;
                                          weeks?: number;
                                          months?: number;
                                          years?: number;
                                        };
                                          sub?: {
                                            milliseconds?: number;
                                            seconds?: number;
                                            minutes?: number;
                                            hours?: number;
                                            days?: number;
                                            weeks?: number;
                                            months?: number;
                                            years?: number;
                                          };
                                            truncateTo?: Timestamp_Interval | null;
                                    };
                                      updatedAt_update?: ({
                                        inc?: {
                                          milliseconds?: number;
                                          seconds?: number;
                                          minutes?: number;
                                          hours?: number;
                                          days?: number;
                                          weeks?: number;
                                          months?: number;
                                          years?: number;
                                        };
                                          dec?: {
                                            milliseconds?: number;
                                            seconds?: number;
                                            minutes?: number;
                                            hours?: number;
                                            days?: number;
                                            weeks?: number;
                                            months?: number;
                                            years?: number;
                                          };
                                      })[];
  };
}

export interface CreateTenantData {
  tenant_insert: Tenant_Key;
}

export interface CreateTenantVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessSector?: string | null;
      businessSector_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              location?: string | null;
              location_expr?: {
              };
                logoUrl?: string | null;
                logoUrl_expr?: {
                };
                  name?: string | null;
                  name_expr?: {
                  };
                    ownerEmail?: string | null;
                    ownerEmail_expr?: {
                    };
                      subscriptionTier?: string | null;
                      subscriptionTier_expr?: {
                      };
                        taxId?: string | null;
                        taxId_expr?: {
                        };
  };
}

export interface CreateTransactionData {
  transaction_insert: Transaction_Key;
}

export interface CreateTransactionVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      amount?: number | null;
      amount_expr?: {
      };
        amount_update?: ({
          inc?: number | null;
          dec?: number | null;
        })[];
          businessId?: UUIDString | null;
          businessId_expr?: {
          };
            category?: string | null;
            category_expr?: {
            };
              createdAt?: TimestampString | null;
              createdAt_expr?: {
              };
                createdAt_time?: {
                  now?: {
                  };
                    at?: TimestampString | null;
                    add?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      sub?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        truncateTo?: Timestamp_Interval | null;
                };
                  createdAt_update?: ({
                    inc?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      dec?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                  })[];
                    date?: TimestampString | null;
                    date_expr?: {
                    };
                      date_time?: {
                        now?: {
                        };
                          at?: TimestampString | null;
                          add?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            sub?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              truncateTo?: Timestamp_Interval | null;
                      };
                        date_update?: ({
                          inc?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            dec?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                        })[];
                          receiptUrl?: string | null;
                          receiptUrl_expr?: {
                          };
                            recordedBy?: UUIDString | null;
                            recordedBy_expr?: {
                            };
                              tenantId?: UUIDString | null;
                              tenantId_expr?: {
                              };
                                type?: string | null;
                                type_expr?: {
                                };
  };
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              department?: string | null;
              department_expr?: {
              };
                email?: string | null;
                email_expr?: {
                };
                  phoneNumber?: string | null;
                  phoneNumber_expr?: {
                  };
                    role?: string | null;
                    role_expr?: {
                    };
                      tenantId?: UUIDString | null;
                      tenantId_expr?: {
                      };
  };
}

export interface Customer_Key {
  id: UUIDString;
  __typename?: 'Customer_Key';
}

export interface DeleteBusinessData {
  business_delete?: Business_Key | null;
}

export interface DeleteBusinessVariables {
  id: UUIDString;
}

export interface DeleteCustomerData {
  customer_delete?: Customer_Key | null;
}

export interface DeleteCustomerVariables {
  id: UUIDString;
}

export interface DeleteDocumentData {
  document_delete?: Document_Key | null;
}

export interface DeleteDocumentVariables {
  id: UUIDString;
}

export interface DeleteEmployeeData {
  employee_delete?: Employee_Key | null;
}

export interface DeleteEmployeeVariables {
  id: UUIDString;
}

export interface DeleteProductData {
  product_delete?: Product_Key | null;
}

export interface DeleteProductVariables {
  id: UUIDString;
}

export interface DeleteSupplierData {
  supplier_delete?: Supplier_Key | null;
}

export interface DeleteSupplierVariables {
  id: UUIDString;
}

export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}

export interface DeleteTaskVariables {
  id: UUIDString;
}

export interface DeleteTenantData {
  tenant_delete?: Tenant_Key | null;
}

export interface DeleteTenantVariables {
  id: UUIDString;
}

export interface DeleteTransactionData {
  transaction_delete?: Transaction_Key | null;
}

export interface DeleteTransactionVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteUserVariables {
  id: UUIDString;
}

export interface Document_Key {
  id: UUIDString;
  __typename?: 'Document_Key';
}

export interface Employee_Key {
  id: UUIDString;
  __typename?: 'Employee_Key';
}

export interface ListBusinessesData {
  businesses: ({
    id: UUIDString;
    name: string;
    location: string;
  } & Business_Key)[];
}

export interface ListBusinessesVariables {
  tenantId: UUIDString;
}

export interface ListCustomersData {
  customers: ({
    id: UUIDString;
    customerName: string;
  } & Customer_Key)[];
}

export interface ListCustomersVariables {
  businessId: UUIDString;
}

export interface ListDocumentsData {
  documents: ({
    id: UUIDString;
    title: string;
  } & Document_Key)[];
}

export interface ListDocumentsVariables {
  businessId: UUIDString;
}

export interface ListEmployeesData {
  employees: ({
    id: UUIDString;
    fullName: string;
  } & Employee_Key)[];
}

export interface ListEmployeesVariables {
  businessId: UUIDString;
}

export interface ListProductsData {
  products: ({
    id: UUIDString;
    name: string;
    sellingPrice: number;
  } & Product_Key)[];
}

export interface ListProductsVariables {
  businessId: UUIDString;
}

export interface ListSuppliersData {
  suppliers: ({
    id: UUIDString;
    supplierName: string;
  } & Supplier_Key)[];
}

export interface ListSuppliersVariables {
  businessId: UUIDString;
}

export interface ListTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    status: string;
  } & Task_Key)[];
}

export interface ListTasksVariables {
  businessId: UUIDString;
}

export interface ListTenantsData {
  tenants: ({
    id: UUIDString;
    name: string;
    businessSector: string;
  } & Tenant_Key)[];
}

export interface ListTransactionsData {
  transactions: ({
    id: UUIDString;
    type: string;
    amount: number;
  } & Transaction_Key)[];
}

export interface ListTransactionsVariables {
  businessId: UUIDString;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
}

export interface ListUsersData {
  users: ({
<<<<<<< HEAD
    id: string;
    username: string;
  } & User_Key)[];
}

export interface MovieMetadata_Key {
  id: UUIDString;
  __typename?: 'MovieMetadata_Key';
}

export interface Movie_Key {
  id: UUIDString;
  __typename?: 'Movie_Key';
}

export interface Review_Key {
  userId: string;
  movieId: UUIDString;
  __typename?: 'Review_Key';
}

export interface SearchMovieData {
  movies: ({
    id: UUIDString;
    title: string;
    genre?: string | null;
    imageUrl: string;
  } & Movie_Key)[];
}

export interface SearchMovieVariables {
  titleInput?: string | null;
  genre?: string | null;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  username: string;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface ListMoviesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMoviesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMoviesData, undefined>;
  operationName: string;
}
export const listMoviesRef: ListMoviesRef;

export function listMovies(): QueryPromise<ListMoviesData, undefined>;
export function listMovies(dc: DataConnect): QueryPromise<ListMoviesData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
=======
    id: UUIDString;
    email: string;
    role: string;
  } & User_Key)[];
}

export interface ListUsersVariables {
  tenantId: UUIDString;
}

export interface Notification_Key {
  id: UUIDString;
  __typename?: 'Notification_Key';
}

export interface Product_Key {
  id: UUIDString;
  __typename?: 'Product_Key';
}

export interface Supplier_Key {
  id: UUIDString;
  __typename?: 'Supplier_Key';
}

export interface TaskComment_Key {
  id: UUIDString;
  __typename?: 'TaskComment_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface Tenant_Key {
  id: UUIDString;
  __typename?: 'Tenant_Key';
}

export interface Transaction_Key {
  id: UUIDString;
  __typename?: 'Transaction_Key';
}

export interface UpdateBusinessData {
  business_update?: Business_Key | null;
}

export interface UpdateBusinessVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessType?: string | null;
      businessType_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              location?: string | null;
              location_expr?: {
              };
                name?: string | null;
                name_expr?: {
                };
                  region?: string | null;
                  region_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}

export interface UpdateCustomerData {
  customer_update?: Customer_Key | null;
}

export interface UpdateCustomerVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              customerName?: string | null;
              customerName_expr?: {
              };
                email?: string | null;
                email_expr?: {
                };
                  phoneNumber?: string | null;
                  phoneNumber_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}

export interface UpdateDocumentData {
  document_update?: Document_Key | null;
}

export interface UpdateDocumentVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        documentType?: string | null;
        documentType_expr?: {
        };
          fileUrl?: string | null;
          fileUrl_expr?: {
          };
            tenantId?: UUIDString | null;
            tenantId_expr?: {
            };
              title?: string | null;
              title_expr?: {
              };
                uploadedAt?: TimestampString | null;
                uploadedAt_expr?: {
                };
                  uploadedAt_time?: {
                    now?: {
                    };
                      at?: TimestampString | null;
                      add?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        sub?: {
                          milliseconds?: number;
                          seconds?: number;
                          minutes?: number;
                          hours?: number;
                          days?: number;
                          weeks?: number;
                          months?: number;
                          years?: number;
                        };
                          truncateTo?: Timestamp_Interval | null;
                  };
                    uploadedAt_update?: ({
                      inc?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        dec?: {
                          milliseconds?: number;
                          seconds?: number;
                          minutes?: number;
                          hours?: number;
                          days?: number;
                          weeks?: number;
                          months?: number;
                          years?: number;
                        };
                    })[];
                      uploadedBy?: UUIDString | null;
                      uploadedBy_expr?: {
                      };
  };
}

export interface UpdateEmployeeData {
  employee_update?: Employee_Key | null;
}

export interface UpdateEmployeeVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              department?: string | null;
              department_expr?: {
              };
                fullName?: string | null;
                fullName_expr?: {
                };
                  position?: string | null;
                  position_expr?: {
                  };
                    salary?: number | null;
                    salary_expr?: {
                    };
                      salary_update?: ({
                        inc?: number | null;
                        dec?: number | null;
                      })[];
                        startDate?: DateString | null;
                        startDate_expr?: {
                        };
                          startDate_date?: {
                            today?: {
                            };
                              on?: DateString | null;
                              add?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                sub?: {
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                                  truncateTo?: Date_Interval | null;
                          };
                            startDate_update?: ({
                              inc?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                dec?: {
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                            })[];
                              status?: string | null;
                              status_expr?: {
                              };
                                tenantId?: UUIDString | null;
                                tenantId_expr?: {
                                };
  };
}

export interface UpdateProductData {
  product_update?: Product_Key | null;
}

export interface UpdateProductVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        category?: string | null;
        category_expr?: {
        };
          costPrice?: number | null;
          costPrice_expr?: {
          };
            costPrice_update?: ({
              inc?: number | null;
              dec?: number | null;
            })[];
              createdAt?: TimestampString | null;
              createdAt_expr?: {
              };
                createdAt_time?: {
                  now?: {
                  };
                    at?: TimestampString | null;
                    add?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      sub?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        truncateTo?: Timestamp_Interval | null;
                };
                  createdAt_update?: ({
                    inc?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      dec?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                  })[];
                    createdBy?: UUIDString | null;
                    createdBy_expr?: {
                    };
                      expiryDate?: DateString | null;
                      expiryDate_expr?: {
                      };
                        expiryDate_date?: {
                          today?: {
                          };
                            on?: DateString | null;
                            add?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              sub?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                truncateTo?: Date_Interval | null;
                        };
                          expiryDate_update?: ({
                            inc?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              dec?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                          })[];
                            lowStockLevel?: number | null;
                            lowStockLevel_expr?: {
                            };
                              lowStockLevel_update?: ({
                                inc?: number | null;
                                dec?: number | null;
                              })[];
                                name?: string | null;
                                name_expr?: {
                                };
                                  quantity?: number | null;
                                  quantity_expr?: {
                                  };
                                    quantity_update?: ({
                                      inc?: number | null;
                                      dec?: number | null;
                                    })[];
                                      sellingPrice?: number | null;
                                      sellingPrice_expr?: {
                                      };
                                        sellingPrice_update?: ({
                                          inc?: number | null;
                                          dec?: number | null;
                                        })[];
                                          tenantId?: UUIDString | null;
                                          tenantId_expr?: {
                                          };
                                            updatedAt?: TimestampString | null;
                                            updatedAt_expr?: {
                                            };
                                              updatedAt_time?: {
                                                now?: {
                                                };
                                                  at?: TimestampString | null;
                                                  add?: {
                                                    milliseconds?: number;
                                                    seconds?: number;
                                                    minutes?: number;
                                                    hours?: number;
                                                    days?: number;
                                                    weeks?: number;
                                                    months?: number;
                                                    years?: number;
                                                  };
                                                    sub?: {
                                                      milliseconds?: number;
                                                      seconds?: number;
                                                      minutes?: number;
                                                      hours?: number;
                                                      days?: number;
                                                      weeks?: number;
                                                      months?: number;
                                                      years?: number;
                                                    };
                                                      truncateTo?: Timestamp_Interval | null;
                                              };
                                                updatedAt_update?: ({
                                                  inc?: {
                                                    milliseconds?: number;
                                                    seconds?: number;
                                                    minutes?: number;
                                                    hours?: number;
                                                    days?: number;
                                                    weeks?: number;
                                                    months?: number;
                                                    years?: number;
                                                  };
                                                    dec?: {
                                                      milliseconds?: number;
                                                      seconds?: number;
                                                      minutes?: number;
                                                      hours?: number;
                                                      days?: number;
                                                      weeks?: number;
                                                      months?: number;
                                                      years?: number;
                                                    };
                                                })[];
  };
}

export interface UpdateSupplierData {
  supplier_update?: Supplier_Key | null;
}

export interface UpdateSupplierVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              email?: string | null;
              email_expr?: {
              };
                phoneNumber?: string | null;
                phoneNumber_expr?: {
                };
                  supplierName?: string | null;
                  supplierName_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}

export interface UpdateTaskData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      assignedToId?: UUIDString | null;
      assignedToId_expr?: {
      };
        assignedTo?: User_Key | null;
        businessId?: UUIDString | null;
        businessId_expr?: {
        };
          createdAt?: TimestampString | null;
          createdAt_expr?: {
          };
            createdAt_time?: {
              now?: {
              };
                at?: TimestampString | null;
                add?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  sub?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
                    truncateTo?: Timestamp_Interval | null;
            };
              createdAt_update?: ({
                inc?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  dec?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
              })[];
                createdBy?: UUIDString | null;
                createdBy_expr?: {
                };
                  description?: string | null;
                  description_expr?: {
                  };
                    dueDate?: TimestampString | null;
                    dueDate_expr?: {
                    };
                      dueDate_time?: {
                        now?: {
                        };
                          at?: TimestampString | null;
                          add?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            sub?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              truncateTo?: Timestamp_Interval | null;
                      };
                        dueDate_update?: ({
                          inc?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            dec?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                        })[];
                          priority?: string | null;
                          priority_expr?: {
                          };
                            status?: string | null;
                            status_expr?: {
                            };
                              tenantId?: UUIDString | null;
                              tenantId_expr?: {
                              };
                                title?: string | null;
                                title_expr?: {
                                };
                                  updatedAt?: TimestampString | null;
                                  updatedAt_expr?: {
                                  };
                                    updatedAt_time?: {
                                      now?: {
                                      };
                                        at?: TimestampString | null;
                                        add?: {
                                          milliseconds?: number;
                                          seconds?: number;
                                          minutes?: number;
                                          hours?: number;
                                          days?: number;
                                          weeks?: number;
                                          months?: number;
                                          years?: number;
                                        };
                                          sub?: {
                                            milliseconds?: number;
                                            seconds?: number;
                                            minutes?: number;
                                            hours?: number;
                                            days?: number;
                                            weeks?: number;
                                            months?: number;
                                            years?: number;
                                          };
                                            truncateTo?: Timestamp_Interval | null;
                                    };
                                      updatedAt_update?: ({
                                        inc?: {
                                          milliseconds?: number;
                                          seconds?: number;
                                          minutes?: number;
                                          hours?: number;
                                          days?: number;
                                          weeks?: number;
                                          months?: number;
                                          years?: number;
                                        };
                                          dec?: {
                                            milliseconds?: number;
                                            seconds?: number;
                                            minutes?: number;
                                            hours?: number;
                                            days?: number;
                                            weeks?: number;
                                            months?: number;
                                            years?: number;
                                          };
                                      })[];
  };
}

export interface UpdateTenantData {
  tenant_update?: Tenant_Key | null;
}

export interface UpdateTenantVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessSector?: string | null;
      businessSector_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              location?: string | null;
              location_expr?: {
              };
                logoUrl?: string | null;
                logoUrl_expr?: {
                };
                  name?: string | null;
                  name_expr?: {
                  };
                    ownerEmail?: string | null;
                    ownerEmail_expr?: {
                    };
                      subscriptionTier?: string | null;
                      subscriptionTier_expr?: {
                      };
                        taxId?: string | null;
                        taxId_expr?: {
                        };
  };
}

export interface UpdateTransactionData {
  transaction_update?: Transaction_Key | null;
}

export interface UpdateTransactionVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      amount?: number | null;
      amount_expr?: {
      };
        amount_update?: ({
          inc?: number | null;
          dec?: number | null;
        })[];
          businessId?: UUIDString | null;
          businessId_expr?: {
          };
            category?: string | null;
            category_expr?: {
            };
              createdAt?: TimestampString | null;
              createdAt_expr?: {
              };
                createdAt_time?: {
                  now?: {
                  };
                    at?: TimestampString | null;
                    add?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      sub?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        truncateTo?: Timestamp_Interval | null;
                };
                  createdAt_update?: ({
                    inc?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      dec?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                  })[];
                    date?: TimestampString | null;
                    date_expr?: {
                    };
                      date_time?: {
                        now?: {
                        };
                          at?: TimestampString | null;
                          add?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            sub?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              truncateTo?: Timestamp_Interval | null;
                      };
                        date_update?: ({
                          inc?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            dec?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                        })[];
                          receiptUrl?: string | null;
                          receiptUrl_expr?: {
                          };
                            recordedBy?: UUIDString | null;
                            recordedBy_expr?: {
                            };
                              tenantId?: UUIDString | null;
                              tenantId_expr?: {
                              };
                                type?: string | null;
                                type_expr?: {
                                };
  };
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              department?: string | null;
              department_expr?: {
              };
                email?: string | null;
                email_expr?: {
                };
                  phoneNumber?: string | null;
                  phoneNumber_expr?: {
                  };
                    role?: string | null;
                    role_expr?: {
                    };
                      tenantId?: UUIDString | null;
                      tenantId_expr?: {
                      };
  };
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateTenantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTenantVariables): MutationRef<CreateTenantData, CreateTenantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTenantVariables): MutationRef<CreateTenantData, CreateTenantVariables>;
  operationName: string;
}
export const createTenantRef: CreateTenantRef;

export function createTenant(vars: CreateTenantVariables): MutationPromise<CreateTenantData, CreateTenantVariables>;
export function createTenant(dc: DataConnect, vars: CreateTenantVariables): MutationPromise<CreateTenantData, CreateTenantVariables>;

interface UpdateTenantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTenantVariables): MutationRef<UpdateTenantData, UpdateTenantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTenantVariables): MutationRef<UpdateTenantData, UpdateTenantVariables>;
  operationName: string;
}
export const updateTenantRef: UpdateTenantRef;

export function updateTenant(vars: UpdateTenantVariables): MutationPromise<UpdateTenantData, UpdateTenantVariables>;
export function updateTenant(dc: DataConnect, vars: UpdateTenantVariables): MutationPromise<UpdateTenantData, UpdateTenantVariables>;

interface DeleteTenantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTenantVariables): MutationRef<DeleteTenantData, DeleteTenantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTenantVariables): MutationRef<DeleteTenantData, DeleteTenantVariables>;
  operationName: string;
}
export const deleteTenantRef: DeleteTenantRef;

export function deleteTenant(vars: DeleteTenantVariables): MutationPromise<DeleteTenantData, DeleteTenantVariables>;
export function deleteTenant(dc: DataConnect, vars: DeleteTenantVariables): MutationPromise<DeleteTenantData, DeleteTenantVariables>;

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;
export function deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface CreateBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
  operationName: string;
}
export const createBusinessRef: CreateBusinessRef;

export function createBusiness(vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;
export function createBusiness(dc: DataConnect, vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;

interface UpdateBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBusinessVariables): MutationRef<UpdateBusinessData, UpdateBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBusinessVariables): MutationRef<UpdateBusinessData, UpdateBusinessVariables>;
  operationName: string;
}
export const updateBusinessRef: UpdateBusinessRef;

export function updateBusiness(vars: UpdateBusinessVariables): MutationPromise<UpdateBusinessData, UpdateBusinessVariables>;
export function updateBusiness(dc: DataConnect, vars: UpdateBusinessVariables): MutationPromise<UpdateBusinessData, UpdateBusinessVariables>;

interface DeleteBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBusinessVariables): MutationRef<DeleteBusinessData, DeleteBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBusinessVariables): MutationRef<DeleteBusinessData, DeleteBusinessVariables>;
  operationName: string;
}
export const deleteBusinessRef: DeleteBusinessRef;

export function deleteBusiness(vars: DeleteBusinessVariables): MutationPromise<DeleteBusinessData, DeleteBusinessVariables>;
export function deleteBusiness(dc: DataConnect, vars: DeleteBusinessVariables): MutationPromise<DeleteBusinessData, DeleteBusinessVariables>;

interface CreateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  operationName: string;
}
export const createProductRef: CreateProductRef;

export function createProduct(vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;
export function createProduct(dc: DataConnect, vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface UpdateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  operationName: string;
}
export const updateProductRef: UpdateProductRef;

export function updateProduct(vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;
export function updateProduct(dc: DataConnect, vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;

interface DeleteProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  operationName: string;
}
export const deleteProductRef: DeleteProductRef;

export function deleteProduct(vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;
export function deleteProduct(dc: DataConnect, vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface CreateTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
  operationName: string;
}
export const createTransactionRef: CreateTransactionRef;

export function createTransaction(vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;
export function createTransaction(dc: DataConnect, vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;

interface UpdateTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTransactionVariables): MutationRef<UpdateTransactionData, UpdateTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTransactionVariables): MutationRef<UpdateTransactionData, UpdateTransactionVariables>;
  operationName: string;
}
export const updateTransactionRef: UpdateTransactionRef;

export function updateTransaction(vars: UpdateTransactionVariables): MutationPromise<UpdateTransactionData, UpdateTransactionVariables>;
export function updateTransaction(dc: DataConnect, vars: UpdateTransactionVariables): MutationPromise<UpdateTransactionData, UpdateTransactionVariables>;

interface DeleteTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
  operationName: string;
}
export const deleteTransactionRef: DeleteTransactionRef;

export function deleteTransaction(vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;
export function deleteTransaction(dc: DataConnect, vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;

interface CreateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  operationName: string;
}
export const createTaskRef: CreateTaskRef;

export function createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;
export function createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface UpdateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
  operationName: string;
}
export const updateTaskRef: UpdateTaskRef;

export function updateTask(vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;
export function updateTask(dc: DataConnect, vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;

interface DeleteTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  operationName: string;
}
export const deleteTaskRef: DeleteTaskRef;

export function deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;
export function deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface CreateEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
  operationName: string;
}
export const createEmployeeRef: CreateEmployeeRef;

export function createEmployee(vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;
export function createEmployee(dc: DataConnect, vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;

interface UpdateEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
  operationName: string;
}
export const updateEmployeeRef: UpdateEmployeeRef;

export function updateEmployee(vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;
export function updateEmployee(dc: DataConnect, vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;

interface DeleteEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEmployeeVariables): MutationRef<DeleteEmployeeData, DeleteEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteEmployeeVariables): MutationRef<DeleteEmployeeData, DeleteEmployeeVariables>;
  operationName: string;
}
export const deleteEmployeeRef: DeleteEmployeeRef;

export function deleteEmployee(vars: DeleteEmployeeVariables): MutationPromise<DeleteEmployeeData, DeleteEmployeeVariables>;
export function deleteEmployee(dc: DataConnect, vars: DeleteEmployeeVariables): MutationPromise<DeleteEmployeeData, DeleteEmployeeVariables>;

interface CreateCustomerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCustomerVariables): MutationRef<CreateCustomerData, CreateCustomerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCustomerVariables): MutationRef<CreateCustomerData, CreateCustomerVariables>;
  operationName: string;
}
export const createCustomerRef: CreateCustomerRef;

export function createCustomer(vars: CreateCustomerVariables): MutationPromise<CreateCustomerData, CreateCustomerVariables>;
export function createCustomer(dc: DataConnect, vars: CreateCustomerVariables): MutationPromise<CreateCustomerData, CreateCustomerVariables>;

interface UpdateCustomerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCustomerVariables): MutationRef<UpdateCustomerData, UpdateCustomerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCustomerVariables): MutationRef<UpdateCustomerData, UpdateCustomerVariables>;
  operationName: string;
}
export const updateCustomerRef: UpdateCustomerRef;

export function updateCustomer(vars: UpdateCustomerVariables): MutationPromise<UpdateCustomerData, UpdateCustomerVariables>;
export function updateCustomer(dc: DataConnect, vars: UpdateCustomerVariables): MutationPromise<UpdateCustomerData, UpdateCustomerVariables>;

interface DeleteCustomerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCustomerVariables): MutationRef<DeleteCustomerData, DeleteCustomerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCustomerVariables): MutationRef<DeleteCustomerData, DeleteCustomerVariables>;
  operationName: string;
}
export const deleteCustomerRef: DeleteCustomerRef;

export function deleteCustomer(vars: DeleteCustomerVariables): MutationPromise<DeleteCustomerData, DeleteCustomerVariables>;
export function deleteCustomer(dc: DataConnect, vars: DeleteCustomerVariables): MutationPromise<DeleteCustomerData, DeleteCustomerVariables>;

interface CreateSupplierRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSupplierVariables): MutationRef<CreateSupplierData, CreateSupplierVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSupplierVariables): MutationRef<CreateSupplierData, CreateSupplierVariables>;
  operationName: string;
}
export const createSupplierRef: CreateSupplierRef;

export function createSupplier(vars: CreateSupplierVariables): MutationPromise<CreateSupplierData, CreateSupplierVariables>;
export function createSupplier(dc: DataConnect, vars: CreateSupplierVariables): MutationPromise<CreateSupplierData, CreateSupplierVariables>;

interface UpdateSupplierRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSupplierVariables): MutationRef<UpdateSupplierData, UpdateSupplierVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSupplierVariables): MutationRef<UpdateSupplierData, UpdateSupplierVariables>;
  operationName: string;
}
export const updateSupplierRef: UpdateSupplierRef;

export function updateSupplier(vars: UpdateSupplierVariables): MutationPromise<UpdateSupplierData, UpdateSupplierVariables>;
export function updateSupplier(dc: DataConnect, vars: UpdateSupplierVariables): MutationPromise<UpdateSupplierData, UpdateSupplierVariables>;

interface DeleteSupplierRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSupplierVariables): MutationRef<DeleteSupplierData, DeleteSupplierVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSupplierVariables): MutationRef<DeleteSupplierData, DeleteSupplierVariables>;
  operationName: string;
}
export const deleteSupplierRef: DeleteSupplierRef;

export function deleteSupplier(vars: DeleteSupplierVariables): MutationPromise<DeleteSupplierData, DeleteSupplierVariables>;
export function deleteSupplier(dc: DataConnect, vars: DeleteSupplierVariables): MutationPromise<DeleteSupplierData, DeleteSupplierVariables>;

interface CreateDocumentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDocumentVariables): MutationRef<CreateDocumentData, CreateDocumentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDocumentVariables): MutationRef<CreateDocumentData, CreateDocumentVariables>;
  operationName: string;
}
export const createDocumentRef: CreateDocumentRef;

export function createDocument(vars: CreateDocumentVariables): MutationPromise<CreateDocumentData, CreateDocumentVariables>;
export function createDocument(dc: DataConnect, vars: CreateDocumentVariables): MutationPromise<CreateDocumentData, CreateDocumentVariables>;

interface UpdateDocumentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDocumentVariables): MutationRef<UpdateDocumentData, UpdateDocumentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDocumentVariables): MutationRef<UpdateDocumentData, UpdateDocumentVariables>;
  operationName: string;
}
export const updateDocumentRef: UpdateDocumentRef;

export function updateDocument(vars: UpdateDocumentVariables): MutationPromise<UpdateDocumentData, UpdateDocumentVariables>;
export function updateDocument(dc: DataConnect, vars: UpdateDocumentVariables): MutationPromise<UpdateDocumentData, UpdateDocumentVariables>;

interface DeleteDocumentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDocumentVariables): MutationRef<DeleteDocumentData, DeleteDocumentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteDocumentVariables): MutationRef<DeleteDocumentData, DeleteDocumentVariables>;
  operationName: string;
}
export const deleteDocumentRef: DeleteDocumentRef;

export function deleteDocument(vars: DeleteDocumentVariables): MutationPromise<DeleteDocumentData, DeleteDocumentVariables>;
export function deleteDocument(dc: DataConnect, vars: DeleteDocumentVariables): MutationPromise<DeleteDocumentData, DeleteDocumentVariables>;

interface ListTenantsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTenantsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTenantsData, undefined>;
  operationName: string;
}
export const listTenantsRef: ListTenantsRef;

export function listTenants(): QueryPromise<ListTenantsData, undefined>;
export function listTenants(dc: DataConnect): QueryPromise<ListTenantsData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUsersVariables): QueryRef<ListUsersData, ListUsersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUsersVariables): QueryRef<ListUsersData, ListUsersVariables>;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
  operationName: string;
}
export const listUsersRef: ListUsersRef;

<<<<<<< HEAD
export function listUsers(): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect): QueryPromise<ListUsersData, undefined>;

interface ListUserReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserReviewsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUserReviewsData, undefined>;
  operationName: string;
}
export const listUserReviewsRef: ListUserReviewsRef;

export function listUserReviews(): QueryPromise<ListUserReviewsData, undefined>;
export function listUserReviews(dc: DataConnect): QueryPromise<ListUserReviewsData, undefined>;

interface GetMovieByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMovieByIdVariables): QueryRef<GetMovieByIdData, GetMovieByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMovieByIdVariables): QueryRef<GetMovieByIdData, GetMovieByIdVariables>;
  operationName: string;
}
export const getMovieByIdRef: GetMovieByIdRef;

export function getMovieById(vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData, GetMovieByIdVariables>;
export function getMovieById(dc: DataConnect, vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData, GetMovieByIdVariables>;

interface SearchMovieRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchMovieVariables): QueryRef<SearchMovieData, SearchMovieVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: SearchMovieVariables): QueryRef<SearchMovieData, SearchMovieVariables>;
  operationName: string;
}
export const searchMovieRef: SearchMovieRef;

export function searchMovie(vars?: SearchMovieVariables): QueryPromise<SearchMovieData, SearchMovieVariables>;
export function searchMovie(dc: DataConnect, vars?: SearchMovieVariables): QueryPromise<SearchMovieData, SearchMovieVariables>;

interface CreateMovieRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMovieVariables): MutationRef<CreateMovieData, CreateMovieVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMovieVariables): MutationRef<CreateMovieData, CreateMovieVariables>;
  operationName: string;
}
export const createMovieRef: CreateMovieRef;

export function createMovie(vars: CreateMovieVariables): MutationPromise<CreateMovieData, CreateMovieVariables>;
export function createMovie(dc: DataConnect, vars: CreateMovieVariables): MutationPromise<CreateMovieData, CreateMovieVariables>;

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface AddReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
  operationName: string;
}
export const addReviewRef: AddReviewRef;

export function addReview(vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;
export function addReview(dc: DataConnect, vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;

interface DeleteReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  operationName: string;
}
export const deleteReviewRef: DeleteReviewRef;

export function deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;
export function deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;
=======
export function listUsers(vars: ListUsersVariables): QueryPromise<ListUsersData, ListUsersVariables>;
export function listUsers(dc: DataConnect, vars: ListUsersVariables): QueryPromise<ListUsersData, ListUsersVariables>;

interface ListBusinessesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListBusinessesVariables): QueryRef<ListBusinessesData, ListBusinessesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListBusinessesVariables): QueryRef<ListBusinessesData, ListBusinessesVariables>;
  operationName: string;
}
export const listBusinessesRef: ListBusinessesRef;

export function listBusinesses(vars: ListBusinessesVariables): QueryPromise<ListBusinessesData, ListBusinessesVariables>;
export function listBusinesses(dc: DataConnect, vars: ListBusinessesVariables): QueryPromise<ListBusinessesData, ListBusinessesVariables>;

interface ListProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductsVariables): QueryRef<ListProductsData, ListProductsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListProductsVariables): QueryRef<ListProductsData, ListProductsVariables>;
  operationName: string;
}
export const listProductsRef: ListProductsRef;

export function listProducts(vars: ListProductsVariables): QueryPromise<ListProductsData, ListProductsVariables>;
export function listProducts(dc: DataConnect, vars: ListProductsVariables): QueryPromise<ListProductsData, ListProductsVariables>;

interface ListTransactionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
  operationName: string;
}
export const listTransactionsRef: ListTransactionsRef;

export function listTransactions(vars: ListTransactionsVariables): QueryPromise<ListTransactionsData, ListTransactionsVariables>;
export function listTransactions(dc: DataConnect, vars: ListTransactionsVariables): QueryPromise<ListTransactionsData, ListTransactionsVariables>;

interface ListTasksRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
  operationName: string;
}
export const listTasksRef: ListTasksRef;

export function listTasks(vars: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;
export function listTasks(dc: DataConnect, vars: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;

interface ListEmployeesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEmployeesVariables): QueryRef<ListEmployeesData, ListEmployeesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListEmployeesVariables): QueryRef<ListEmployeesData, ListEmployeesVariables>;
  operationName: string;
}
export const listEmployeesRef: ListEmployeesRef;

export function listEmployees(vars: ListEmployeesVariables): QueryPromise<ListEmployeesData, ListEmployeesVariables>;
export function listEmployees(dc: DataConnect, vars: ListEmployeesVariables): QueryPromise<ListEmployeesData, ListEmployeesVariables>;

interface ListCustomersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCustomersVariables): QueryRef<ListCustomersData, ListCustomersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCustomersVariables): QueryRef<ListCustomersData, ListCustomersVariables>;
  operationName: string;
}
export const listCustomersRef: ListCustomersRef;

export function listCustomers(vars: ListCustomersVariables): QueryPromise<ListCustomersData, ListCustomersVariables>;
export function listCustomers(dc: DataConnect, vars: ListCustomersVariables): QueryPromise<ListCustomersData, ListCustomersVariables>;

interface ListSuppliersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSuppliersVariables): QueryRef<ListSuppliersData, ListSuppliersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListSuppliersVariables): QueryRef<ListSuppliersData, ListSuppliersVariables>;
  operationName: string;
}
export const listSuppliersRef: ListSuppliersRef;

export function listSuppliers(vars: ListSuppliersVariables): QueryPromise<ListSuppliersData, ListSuppliersVariables>;
export function listSuppliers(dc: DataConnect, vars: ListSuppliersVariables): QueryPromise<ListSuppliersData, ListSuppliersVariables>;

interface ListDocumentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListDocumentsVariables): QueryRef<ListDocumentsData, ListDocumentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListDocumentsVariables): QueryRef<ListDocumentsData, ListDocumentsVariables>;
  operationName: string;
}
export const listDocumentsRef: ListDocumentsRef;

export function listDocuments(vars: ListDocumentsVariables): QueryPromise<ListDocumentsData, ListDocumentsVariables>;
export function listDocuments(dc: DataConnect, vars: ListDocumentsVariables): QueryPromise<ListDocumentsData, ListDocumentsVariables>;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

