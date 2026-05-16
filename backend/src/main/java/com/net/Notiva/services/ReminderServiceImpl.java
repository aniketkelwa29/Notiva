package com.net.Notiva.services;

import com.net.Notiva.dto.ReminderRequest;
import com.net.Notiva.entity.Reminder;
import com.net.Notiva.entity.ReminderStatus;
import com.net.Notiva.repository.ReminderRepository;
//import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

//@Data
@Service
public class ReminderServiceImpl implements ReminderService {


    @Autowired
    private ReminderRepository reminderRepository;

    @Override
    public Reminder createReminder(ReminderRequest dto) {
        Reminder reminder = new Reminder();

        reminder.setTitle(dto.getTitle());
        if (dto.getReminderTime() != null) {
            reminder.setReminderTime(dto.getReminderTime());
            System.out.println(dto.getReminderTime());
        } else {
            reminder.setReminderTime(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
        }

        reminder.setMessage(dto.getMessage());
        reminder.setNotified(false);
        reminder.setStatus(ReminderStatus.PENIDING);
        return reminderRepository.save(reminder);


    }

    @Override
    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();

    }

    @Override
    public Reminder getReminderById(String id) {
        return reminderRepository.findById(id).orElseThrow();
    }

    @Override
    public Reminder updateReminder(String id, ReminderRequest dto) {
        Reminder reminder = getReminderById(id);

        reminder.setTitle(dto.getTitle());
        reminder.setMessage(dto.getMessage());
        reminder.setReminderTime(dto.getReminderTime());

        return reminderRepository.save(reminder);

    }

    @Override
    public void deleteReminder(String id) {
        reminderRepository.deleteById(id);
    }
}
