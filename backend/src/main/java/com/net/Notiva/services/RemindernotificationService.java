package com.net.Notiva.services;

import com.net.Notiva.entity.Reminder;
import com.net.Notiva.exception.NotificationException;
import com.net.Notiva.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RemindernotificationService {



    @Autowired
    private ReminderRepository reminderRepository;

    public void triggerReminder(Reminder reminder){

        try {
            System.out.println("Reminder triggered"+reminder.getTitle());
            reminder.setNotified(true);
            reminderRepository.save(reminder);
        }
catch (Exception e){
   throw new NotificationException(
           "Failed to trigger Exception "
   );
}
    }
}
