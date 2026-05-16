package com.net.Notiva.services;

import com.net.Notiva.dto.ReminderRequest;
import com.net.Notiva.entity.Reminder;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.List;


public  interface ReminderService {

    Reminder createReminder(ReminderRequest dto);

    List<Reminder>getAllReminders();

    Reminder getReminderById(String id);

    Reminder updateReminder(String id,ReminderRequest dto);

  void deleteReminder(String id);

}
